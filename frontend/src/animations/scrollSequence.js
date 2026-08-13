import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readSequenceConfig(section) {
  return {
    frameCount: Number(section.dataset.frameCount || 216),
    frameStart: Number(section.dataset.frameStart || 1),
    framePad:   Number(section.dataset.framePad   || 4),
    framePath:  section.dataset.framePath || "/images/sequence/frame_{frame}.webp",
  };
}

function getFrameSource(config, frameNumber) {
  const padded = String(frameNumber).padStart(config.framePad, "0");
  return config.framePath
    .replaceAll("{frame}", padded)
    .replaceAll("{index}", String(frameNumber));
}

function updateLoader(section, progress) {
  const text = section.querySelector("[data-sequence-progress]");
  const bar  = section.querySelector("[data-sequence-bar]");
  section.style.setProperty("--sequence-progress", progress + "%");
  if (text) text.textContent = progress + "%";
  if (bar)  bar.style.width  = progress + "%";
}

function showUnavailableState(section) {
  const loader = section.querySelector("[data-sequence-loader]");
  const text   = section.querySelector("[data-sequence-progress]");
  section.classList.add("is-sequence-error");
  if (loader) loader.setAttribute("role", "alert");
  if (text)   text.textContent = "Frames unavailable";
}

function initAndroidStaticSequence(section, sequenceImg, config) {
  section.classList.add("is-sequence-loaded");
  section.classList.add("is-sequence-ready");

  // Adjust structural CSS inline so the image section scrolls naturally 
  // without the 520svh scroll gap or CSS sticky pinning.
  section.style.minHeight = "auto";
  
  const pinEl = section.querySelector(".scroll-sequence__pin");
  if (pinEl) {
    pinEl.style.position = "relative";
    pinEl.style.height = "auto";
    pinEl.style.top = "auto";
    pinEl.style.display = "flex";
    pinEl.style.flexDirection = "column";
    pinEl.style.gap = "0";
    pinEl.style.padding = "0";

    // Hide original DOM elements
    sequenceImg.style.display = "none";
    const canvas = section.querySelector("[data-sequence-canvas]");
    if (canvas) canvas.style.display = "none";

    // Inject 3 keyframes to fill the vertical space (middle is empty placeholder)
    const frameIndices = [config.frameStart, null, config.frameCount];

    frameIndices.forEach((frameIdx) => {
      if (frameIdx === null) {
        // Empty space placeholder
        const placeholder = document.createElement("div");
        placeholder.style.width = "100%";
        placeholder.style.aspectRatio = "16 / 9";
        placeholder.style.display = "block";
        pinEl.appendChild(placeholder);
        return;
      }

      const img = new Image();
      img.src = getFrameSource(config, frameIdx);
      img.style.position = "relative";
      img.style.zIndex = "1";
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.objectFit = "contain";
      img.style.display = "block";
      pinEl.appendChild(img);
    });
  }

  // Remove the loader UI completely
  const loader = section.querySelector(".scroll-sequence__loader");
  if (loader) {
    loader.remove();
  }

  return section;
}

function initImageSequence(section, sequenceImg, sequenceCanvas, config) {
  // ORIGINAL JPEG SEQUENCE LOGIC MIGRATED TO CANVAS
  const ctx = sequenceCanvas ? sequenceCanvas.getContext("2d", { alpha: false }) : null;
  const totalFrames = config.frameCount;
  const frameSrcs = Array.from({ length: totalFrames }, (_, i) =>
    getFrameSource(config, config.frameStart + i)
  );

  const state = {
    started: false,
    currentFrameIndex: -1,
    targetFrameIndex: 0,
    loadedCount: 0,
    initialLoadTarget: 5,
  };

  const cache = new Map();
  const activeRequests = new Map();
  const PRELOAD_AHEAD = 8;
  const PRELOAD_BEHIND = 2;
  const CONCURRENCY_LIMIT = 4;

  const loadQueue = new Set();

  function loadFrame(index) {
    if (cache.has(index)) return Promise.resolve(cache.get(index));
    if (activeRequests.has(index)) return activeRequests.get(index);

    if (activeRequests.size >= CONCURRENCY_LIMIT) {
      return Promise.resolve(null);
    }

    const req = new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
          resolve(null);
          return;
        }
        cache.set(index, img);
        
        if (!state.started) {
          state.loadedCount++;
          updateLoader(section, Math.min(100, Math.round((state.loadedCount / state.initialLoadTarget) * 100)));
        }

        renderTargetFrame();
        resolve(img);
      };

      img.onerror = () => resolve(null);
      console.trace("JPEG FRAME REQUEST SOURCE", frameSrcs[index]);
      img.src = frameSrcs[index];
    }).finally(() => {
      activeRequests.delete(index);
      processLoadQueue();
    });

    activeRequests.set(index, req);
    return req;
  }

  function queueFrameLoad(index) {
    if (index < 0 || index >= totalFrames || cache.has(index) || activeRequests.has(index)) {
      return;
    }
    loadQueue.add(index);
    processLoadQueue();
  }

  function processLoadQueue() {
    if (activeRequests.size >= CONCURRENCY_LIMIT) return;
    if (loadQueue.size === 0) return;

    let toLoad = null;

    if (loadQueue.has(state.targetFrameIndex)) {
      toLoad = state.targetFrameIndex;
    } else {
      let minDistance = Infinity;
      for (const idx of loadQueue) {
        const dist = Math.abs(idx - state.targetFrameIndex);
        if (dist < minDistance) {
          minDistance = dist;
          toLoad = idx;
        }
      }
    }

    if (toLoad !== null) {
      loadQueue.delete(toLoad);
      loadFrame(toLoad);
      processLoadQueue();
    }
  }

  function renderTargetFrame() {
    const target = state.targetFrameIndex;
    evictOldFrames(target);

    const exact = cache.get(target);
    if (exact && exact.complete && exact.naturalWidth > 0) {
      if (state.currentFrameIndex !== target) {
        state.currentFrameIndex = target;
        if (ctx) {
          ctx.drawImage(exact, 0, 0);
        } else {
          sequenceImg.src = exact.src;
        }
      }
      return;
    }

    let bestKey = -1;
    let bestDist = Infinity;
    for (const [key, img] of cache) {
      if (!img.complete || img.naturalWidth === 0) continue;
      const d = Math.abs(key - target);
      if (d < bestDist) { bestDist = d; bestKey = key; }
    }

    if (bestKey !== -1 && state.currentFrameIndex !== bestKey) {
      state.currentFrameIndex = bestKey;
      const fallbackImg = cache.get(bestKey);
      if (ctx) {
        ctx.drawImage(fallbackImg, 0, 0);
      } else {
        sequenceImg.src = fallbackImg.src;
      }
    }
  }

  function evictOldFrames(targetIndex) {
    const RADIUS = 30;
    for (const [key] of cache) {
      if (key === state.currentFrameIndex) continue;
      if (key === state.targetFrameIndex) continue;
      if (activeRequests.has(key)) continue;
      if (Math.abs(key - targetIndex) > RADIUS) {
        cache.delete(key);
      }
    }
  }

  function queueFrameUpdates(targetIndex) {
    state.targetFrameIndex = Math.max(0, Math.min(totalFrames - 1, targetIndex));
    
    for (const idx of loadQueue) {
      if (Math.abs(idx - state.targetFrameIndex) > PRELOAD_AHEAD + PRELOAD_BEHIND) {
        loadQueue.delete(idx);
      }
    }

    queueFrameLoad(state.targetFrameIndex);

    const dir = state.targetFrameIndex >= state.currentFrameIndex ? 1 : -1;
    
    for (let i = 1; i <= PRELOAD_AHEAD; i++) {
      queueFrameLoad(state.targetFrameIndex + (i * dir));
    }
    
    for (let i = 1; i <= PRELOAD_BEHIND; i++) {
      queueFrameLoad(state.targetFrameIndex - (i * dir));
    }

    renderTargetFrame();
  }

  function initGSAPScroll() {
    const pinEl = section.querySelector(".scroll-sequence__pin");
    
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: pinEl,
      scrub: true,
      onUpdate: (self) => {
        const frameIndex = Math.round(self.progress * (totalFrames - 1));
        queueFrameUpdates(frameIndex);
      },
    });

    let resizeTimer = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
  }

  updateLoader(section, 0);
  
  for (let i = 0; i < state.initialLoadTarget; i++) {
    queueFrameLoad(i);
  }

  const firstFrameReq = loadFrame(0);
  if (firstFrameReq) {
    firstFrameReq.then((firstImage) => {
      if (!firstImage) {
        showUnavailableState(section);
        return;
      }

      state.started = true;
      state.currentFrameIndex = 0;
      
      if (sequenceCanvas && ctx) {
        sequenceCanvas.width = firstImage.naturalWidth;
        sequenceCanvas.height = firstImage.naturalHeight;
        ctx.drawImage(firstImage, 0, 0);
        sequenceCanvas.style.display = "block";
        sequenceImg.style.display = "none";
      } else {
        sequenceImg.src = firstImage.src;
      }
      
      section.classList.add("is-sequence-loaded");
      section.classList.add("is-sequence-ready");

      if (prefersReducedMotion()) return;

      initGSAPScroll();
    });
  } else {
    showUnavailableState(section);
  }

  return section;
}

export function initScrollSequence() {
  const section = document.querySelector("[data-scroll-sequence='generator']");
  if (!section) return null;

  const sequenceImg = section.querySelector("[data-sequence-image]");
  const sequenceCanvas = section.querySelector("[data-sequence-canvas]");
  if (!sequenceImg) return null;

  const config = readSequenceConfig(section);

  const isAndroid = /Android/i.test(navigator.userAgent);

  console.log("DEVICE / SEQUENCE MODE", {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
    isAndroid: /Android/i.test(navigator.userAgent)
  });

  console.log(
    "SELECTED SEQUENCE RENDERER:",
    isAndroid ? "ANDROID STATIC IMAGE" : "JPEG IMAGE SEQUENCE"
  );

  if (isAndroid) {
    return initAndroidStaticSequence(section, sequenceImg, config);
  }

  return initImageSequence(section, sequenceImg, sequenceCanvas, config);
}
