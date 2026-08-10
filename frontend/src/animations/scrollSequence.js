

const PRELOAD_CONCURRENCY = 6;
const MAX_DEVICE_PIXEL_RATIO = 2;
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
    frameStep: Number(section.dataset.frameStep || 0),
    frameFit: section.dataset.frameFit || "contain",
  };
}

function getAdaptiveFrameStep(config) {
  if (config.frameStep > 0) {
    return config.frameStep;
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (connection?.saveData) {
    return 4;
  }

  if (window.innerWidth < 700) {
    return 3;
  }

  if (navigator.deviceMemory && navigator.deviceMemory <= 4) {
    return 3;
  }

  return 2;
}

function getFrameSource(config, frameNumber) {
  const paddedFrame = String(frameNumber).padStart(config.framePad, "0");

  return config.framePath
    .replaceAll("{frame}", paddedFrame)
    .replaceAll("{index}", String(frameNumber));
}

function loadImage(src, priority = "auto") {
  return new Promise((resolve) => {
    const image = new Image();

    image.decoding = "async";
    image.loading = "eager";
    if ("fetchPriority" in image) {
      image.fetchPriority = priority;
    }
    image.onload = () => {
      if (!image.decode) {
        resolve({ image, ok: true });
        return;
      }

      image
        .decode()
        .catch(() => null)
        .then(() => resolve({ image, ok: true }));
    };
    image.onerror = () => resolve({ image: null, ok: false });
    image.src = src;
  });
}

function getPreloadOrder(total) {
  const order = [];
  const used = new Set();
  const add = (index) => {
    const safeIndex = Math.max(0, Math.min(total - 1, index));

    if (!used.has(safeIndex)) {
      used.add(safeIndex);
      order.push(safeIndex);
    }
  };

  add(0);
  add(total - 1);

  [8, 4, 2].forEach((segments) => {
    for (let segment = 1; segment < segments; segment += 1) {
      add(Math.round(((total - 1) * segment) / segments));
    }
  });

  for (let index = 0; index < total; index += 1) {
    add(index);
  }

  return order;
}

function preloadImages({ frameOrder, frames, loadFrame }) {
  let cursor = 0;
  let active = 0;

  return new Promise((resolve) => {
    function runNext() {
      while (active < PRELOAD_CONCURRENCY && cursor < frameOrder.length) {
        const frameIndex = frameOrder[cursor];

        cursor += 1;

        if (frames[frameIndex] !== undefined) {
          continue;
        }

        active += 1;
        loadFrame(frameIndex, "auto").finally(() => {
          active -= 1;

          if (cursor >= frameOrder.length && active === 0) {
            resolve(frames);
            return;
          }

          runNext();
        });
      }

      if (cursor >= frameOrder.length && active === 0) {
        resolve(frames);
      }
    }

    runNext();
  });
}

function getNearestFrame(frames, targetIndex) {
  if (frames[targetIndex]) {
    return frames[targetIndex];
  }

  for (let offset = 1; offset < frames.length; offset += 1) {
    const previous = frames[targetIndex - offset];
    const next = frames[targetIndex + offset];

    if (previous) {
      return previous;
    }

    if (next) {
      return next;
    }
  }

  return null;
}

function drawContain(context, image, canvasWidth, canvasHeight, fit) {
  const scale =
    fit === "cover"
      ? Math.max(canvasWidth / image.naturalWidth, canvasHeight / image.naturalHeight)
      : Math.min(canvasWidth / image.naturalWidth, canvasHeight / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const x = (canvasWidth - width) / 2;
  const y = (canvasHeight - height) / 2;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(image, x, y, width, height);
}

function updateLoader(section, completed, total) {
  const progress = total > 0 ? Math.round((completed / total) * 100) : 100;
  const progressText = section.querySelector("[data-sequence-progress]");
  const progressBar = section.querySelector("[data-sequence-bar]");

  section.style.setProperty("--sequence-progress", `${progress}%`);

  if (progressText) {
    progressText.textContent = `${progress}%`;
  }

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
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

  if (!section) {
    return null;
  }

  const canvas = section.querySelector("[data-sequence-canvas]");
  const context = canvas?.getContext("2d");

  if (!canvas || !context) {
    return null;
  }

  const config = readSequenceConfig(section);
  const frameStep = getAdaptiveFrameStep(config);
  const lastFrameNumber = config.frameStart + config.frameCount - 1;
  const frameNumbers = Array.from(
    { length: Math.ceil(config.frameCount / frameStep) },
    (_, index) => Math.min(config.frameStart + index * frameStep, lastFrameNumber),
  );

  if (frameNumbers[frameNumbers.length - 1] !== lastFrameNumber) {
    frameNumbers.push(lastFrameNumber);
  }

  const frameSources = frameNumbers.map((frameNumber) => getFrameSource(config, frameNumber));
  const frameOrder = getPreloadOrder(frameSources.length);
  const frames = new Array(frameSources.length);
  const pendingFrames = new Map();
  const state = {
    completed: 0,
    currentFrame: 0,
    drawFrame: 0,
    rafId: 0,
    started: false,
  };

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  updateLoader(section, 0, frameSources.length);

  function recordFrame(frameIndex, image) {
    if (frames[frameIndex] === undefined) {
      frames[frameIndex] = image;
      state.completed += 1;
      updateLoader(section, state.completed, frameSources.length);
    }

    return image;
  }

  function loadFrame(frameIndex, priority = "auto") {
    if (frames[frameIndex] !== undefined) {
      return Promise.resolve(frames[frameIndex]);
    }

    if (pendingFrames.has(frameIndex)) {
      return pendingFrames.get(frameIndex);
    }

    const frameRequest = loadImage(frameSources[frameIndex], priority)
      .then(({ image }) => recordFrame(frameIndex, image))
      .finally(() => {
        pendingFrames.delete(frameIndex);
      });

    pendingFrames.set(frameIndex, frameRequest);

    return frameRequest;
  }

  function renderFrame(frameIndex) {
    const image = getNearestFrame(frames, frameIndex);

    if (!image) {
      return;
    }

    state.currentFrame = frameIndex;
    drawContain(context, image, canvas.width, canvas.height, config.frameFit);
  }

  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
    const width = Math.max(1, Math.round(bounds.width * pixelRatio));
    const height = Math.max(1, Math.round(bounds.height * pixelRatio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    renderFrame(state.currentFrame);
  }

  function queueFrame(frameIndex) {
    const nextFrame = Math.max(0, Math.min(frames.length - 1, frameIndex));

    state.drawFrame = nextFrame;

    if (frames[nextFrame] === undefined) {
      loadFrame(nextFrame, "high").then((image) => {
        if (image && !state.rafId) {
          state.rafId = window.requestAnimationFrame(() => {
            state.rafId = 0;
            renderFrame(state.drawFrame);
          });
        }
      });
    }

    if (state.rafId) {
      return;
    }

    state.rafId = window.requestAnimationFrame(() => {
      state.rafId = 0;
      renderFrame(state.drawFrame);
    });
  }

  function startSequence() {
    if (state.started) {
      return;
    }

    state.started = true;
    loadFrame(0, "high").then((firstFrame) => {
      if (!firstFrame) {
        showUnavailableState(section);
        return;
      }

      resizeCanvas();
      section.classList.add("is-sequence-loaded");

      if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(resizeCanvas);
        observer.observe(canvas);
      }

      window.addEventListener("resize", resizeCanvas, { passive: true });

      if (prefersReducedMotion()) {
        return;
      }

      let isTicking = false;

      function onScroll() {
        if (!isTicking) {
          isTicking = true;
          window.requestAnimationFrame(() => {
            const rect = section.getBoundingClientRect();
            const scrollDistance = rect.height - window.innerHeight;

            if (scrollDistance > 0) {
              let progress = -rect.top / scrollDistance;
              progress = Math.max(0, Math.min(1, progress));
              queueFrame(Math.round(progress * (frames.length - 1)));
            }
            isTicking = false;
          });
        }
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      preloadImages({ frameOrder, frames, loadFrame }).then(() => {
        section.classList.add("is-sequence-ready");
      });
      window.addEventListener("orientationchange", () => onScroll(), { passive: true });
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
      { rootMargin: SEQUENCE_ROOT_MARGIN },
    );

    observer.observe(section);
  } else {
    startSequence();
  }

  return section;
}
