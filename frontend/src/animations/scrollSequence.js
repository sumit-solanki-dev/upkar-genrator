const SEQUENCE_ROOT_MARGIN = "650px 0px";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readSequenceConfig(section) {
  return {
    frameCount: Number(section.dataset.frameCount || 216),
    frameStart: Number(section.dataset.frameStart || 1),
    framePad: Number(section.dataset.framePad || 4),
    framePath: section.dataset.framePath || "/images/sequence/frame_{frame}.jpg",
  };
}

function getFrameSource(config, frameNumber) {
  const paddedFrame = String(frameNumber).padStart(config.framePad, "0");
  return config.framePath
    .replaceAll("{frame}", paddedFrame)
    .replaceAll("{index}", String(frameNumber));
}

function updateLoader(section, progress) {
  const progressText = section.querySelector("[data-sequence-progress]");
  const progressBar = section.querySelector("[data-sequence-bar]");

  section.style.setProperty("--sequence-progress", progress + "%");

  if (progressText) {
    progressText.textContent = progress + "%";
  }

  if (progressBar) {
    progressBar.style.width = progress + "%";
  }
}

function showUnavailableState(section) {
  const loader = section.querySelector("[data-sequence-loader]");
  const progressText = section.querySelector("[data-sequence-progress]");

  section.classList.add("is-sequence-error");

  if (loader) {
    loader.setAttribute("role", "alert");
  }

  if (progressText) {
    progressText.textContent = "Frames unavailable";
  }
}

export function initScrollSequence() {
  const section = document.querySelector("[data-scroll-sequence='generator']");
  if (!section) return null;

  const sequenceImg = section.querySelector("[data-sequence-image]");
  if (!sequenceImg) return null;

  const config = readSequenceConfig(section);
  const totalFrames = config.frameCount;
  
  // Create an array of all frame URLs
  const frameSources = Array.from({ length: totalFrames }, (_, index) => {
    return getFrameSource(config, config.frameStart + index);
  });

  // State
  const state = {
    started: false,
    currentFrameIndex: 0,
    targetFrameIndex: 0,
    rafId: 0,
    loadedCount: 0
  };

  // Cache caches decoded src strings for immediate application
  const cache = new Map(); // index -> src
  const activeRequests = new Map(); // index -> Promise

  // Evict frames that are far from the target index to prevent memory OOM on mobile
  function evictOldFrames(targetIndex) {
    const WINDOW = 25; // Keep max 50 frames in memory
    for (const key of cache.keys()) {
      if (Math.abs(key - targetIndex) > WINDOW) {
        cache.delete(key);
      }
    }
  }

  function loadFrame(index) {
    if (cache.has(index)) {
      return Promise.resolve(cache.get(index));
    }

    if (activeRequests.has(index)) {
      return activeRequests.get(index);
    }

    const src = frameSources[index];
    const req = new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      
      img.onload = () => {
        if (!img.complete || img.naturalWidth === 0) {
          resolve(null);
          return;
        }
        
        cache.set(index, src);
        
        // Initial loader progress
        if (!state.started) {
          state.loadedCount++;
          updateLoader(section, Math.min(100, Math.round((state.loadedCount / 5) * 100)));
        }
        
        resolve(src);
      };
      
      img.onerror = () => {
        resolve(null);
      };
      
      img.src = src;
    }).finally(() => {
      activeRequests.delete(index);
    });

    activeRequests.set(index, req);
    return req;
  }

  function renderTargetFrame() {
    const target = state.targetFrameIndex;
    
    // Evict faraway frames from cache
    evictOldFrames(target);

    // Only update the actual image if the frame is fully loaded and ready in our cache.
    // This strictly prevents "black frames".
    if (cache.has(target)) {
      state.currentFrameIndex = target;
      sequenceImg.src = cache.get(target);
    }
  }

  function queueFrameUpdate(targetIndex) {
    state.targetFrameIndex = Math.max(0, Math.min(totalFrames - 1, targetIndex));
    
    // 1. Proactively load the target frame immediately
    loadFrame(state.targetFrameIndex).then((src) => {
      if (src && !state.rafId) {
        state.rafId = window.requestAnimationFrame(() => {
          state.rafId = 0;
          renderTargetFrame();
        });
      }
    });

    // 2. Preload upcoming frames in the direction of scrolling
    const direction = state.targetFrameIndex >= state.currentFrameIndex ? 1 : -1;
    const preloadAhead = 4;
    
    for (let i = 1; i <= preloadAhead; i++) {
      const aheadIndex = state.targetFrameIndex + (i * direction);
      if (aheadIndex >= 0 && aheadIndex < totalFrames) {
        // We just kick off the load without awaiting it
        loadFrame(aheadIndex);
      }
    }
    
    // Schedule render
    if (!state.rafId) {
      state.rafId = window.requestAnimationFrame(() => {
        state.rafId = 0;
        renderTargetFrame();
      });
    }
  }

  function startSequence() {
    if (state.started) return;
    
    updateLoader(section, 0);

    // Initial preload: aggressively load the first frame and a few nearby frames
    const initialLoads = [0, 1, 2, 3, 4].map(idx => loadFrame(idx));
    
    // We only wait for the very first frame to safely display it.
    loadFrame(0).then((firstSrc) => {
      if (!firstSrc) {
        showUnavailableState(section);
        return;
      }

      state.started = true;
      state.currentFrameIndex = 0;
      sequenceImg.src = firstSrc;
      
      section.classList.add("is-sequence-loaded");
      section.classList.add("is-sequence-ready");

      if (prefersReducedMotion()) return;

      let isTicking = false;
      let lastDiagLog = 0;

      function onScroll() {
        if (!isTicking) {
          isTicking = true;
          window.requestAnimationFrame(() => {
            const rect = section.getBoundingClientRect();
            const scrollDistance = rect.height - window.innerHeight;
            
            let progress = scrollDistance > 0 ? -rect.top / scrollDistance : null;

            const now = Date.now();
            if (now - lastDiagLog > 200) {
              console.log("--- SEQUENCE DIAGNOSTIC ---", {
                  scrollY: window.scrollY,
                  viewportHeight: window.innerHeight,
                  rectTop: rect.top,
                  rectHeight: rect.height,
                  rectBottom: rect.bottom,
                  scrollDistance,
                  progress,
                  scrollTop: document.documentElement.scrollTop,
                  scrollHeight: document.documentElement.scrollHeight,
                  offsetHeight: section.offsetHeight,
                  sectionScrollHeight: section.scrollHeight,
                  position: window.getComputedStyle(section).position,
                  overflow: window.getComputedStyle(section).overflow,
                  computedHeight: window.getComputedStyle(section).height,
                  visualViewportHeight: window.visualViewport?.height
              });

              let parent = section.parentElement;
              while (parent && parent !== document.documentElement) {
                const style = window.getComputedStyle(parent);
                if (style.overflow !== "visible" || style.position === "fixed" || style.position === "sticky" || style.transform !== "none" || style.contain !== "none") {
                   console.log("RESTRICTIVE PARENT FOUND", {
                     tag: parent.tagName,
                     className: parent.className,
                     overflow: style.overflow,
                     position: style.position,
                     transform: style.transform,
                     height: style.height,
                     contain: style.contain
                   });
                }
                parent = parent.parentElement;
              }

              lastDiagLog = now;
            }

            if (scrollDistance > 0) {
              progress = Math.max(0, Math.min(1, progress));
              queueFrameUpdate(Math.round(progress * (totalFrames - 1)));
            }
            
            isTicking = false;
          });
        }
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("orientationchange", () => onScroll(), { passive: true });
      window.addEventListener("resize", () => onScroll(), { passive: true });
      
      onScroll();
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          startSequence();
        }
      },
      { rootMargin: SEQUENCE_ROOT_MARGIN }
    );
    observer.observe(section);
  } else {
    startSequence();
  }

  return section;
}
