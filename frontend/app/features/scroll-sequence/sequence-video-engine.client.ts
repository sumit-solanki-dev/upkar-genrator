import { clamp, frameIndexForProgress, mediaTimeForFrame } from "./sequence-core";
import { createFrameSequenceEngine } from "./sequence-engine.client";
import type {
  SequenceEngine,
  SequenceEngineOptions,
  SequenceSnapshot,
  SequenceTierName,
  SequenceVideo,
} from "./sequence-types";

interface NetworkInformationLike {
  effectiveType?: string;
}

interface NavigatorWithHints extends Navigator {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
}

const FIRST_FRAME_TIMEOUT_MS = 8_000;
const SEEK_TIMEOUT_MS = 4_000;

function resolveAssetUrl(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  if (path.startsWith("/")) return new URL(path, window.location.origin).href;

  const meta = import.meta as ImportMeta & { env?: { BASE_URL?: string } };
  const configuredBase = meta.env?.BASE_URL ?? "/";
  return new URL(path, new URL(configuredBase, window.location.origin)).href;
}

function chooseTierName(): SequenceTierName {
  const hints = navigator as NavigatorWithHints;
  const effectiveType = hints.connection?.effectiveType;
  const hasSlowConnection = effectiveType === "slow-2g" || effectiveType === "2g";
  const hasLowMemory = typeof hints.deviceMemory === "number" && hints.deviceMemory <= 2;

  if (hasSlowConnection || hasLowMemory) return "lite";
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "full";
}

function supportsVideo(video: HTMLVideoElement, source: SequenceVideo): boolean {
  const mimeType = `${source.type}; codecs="${source.codec}"`;
  return video.canPlayType(mimeType) !== "";
}

function createVideoSequenceEngine(
  options: SequenceEngineOptions,
  source: SequenceVideo,
): SequenceEngine {
  const { section, pin, video, onSnapshot } = options;

  let destroyed = false;
  let started = false;
  let usingFrameFallback = false;
  let nearSection = false;
  let pagePaused = document.hidden;
  let loadStarted = false;
  let mediaReady = false;
  let hasRenderableFrame = false;
  let seekInFlight = false;
  let currentTierName = chooseTierName();
  let currentStatus: SequenceSnapshot["status"] = "loading";
  let targetFrame = 0;
  let presentedFrame: number | null = null;
  let stableViewportHeight = Math.max(1, pin.getBoundingClientRect().height || window.innerHeight);
  let lastViewportWidth = window.innerWidth;
  let animationFrame = 0;
  let presentationFrame = 0;
  let firstFrameTimer = 0;
  let seekTimer = 0;
  let intersectionObserver: IntersectionObserver | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let fallbackEngine: SequenceEngine | null = null;
  let lastSnapshot: SequenceSnapshot | null = null;

  function emit(status: SequenceSnapshot["status"]): void {
    currentStatus = status;
    const next: SequenceSnapshot = {
      status,
      tier: currentTierName,
      hasRenderableFrame,
      renderer: "video",
    };
    if (
      lastSnapshot?.status === next.status &&
      lastSnapshot.tier === next.tier &&
      lastSnapshot.hasRenderableFrame === next.hasRenderableFrame &&
      lastSnapshot.renderer === next.renderer
    ) {
      return;
    }

    lastSnapshot = next;
    if (!destroyed && !usingFrameFallback) onSnapshot(next);
  }

  function clearFirstFrameTimer(): void {
    if (!firstFrameTimer) return;
    window.clearTimeout(firstFrameTimer);
    firstFrameTimer = 0;
  }

  function clearSeekTimer(): void {
    if (!seekTimer) return;
    window.clearTimeout(seekTimer);
    seekTimer = 0;
  }

  function cancelAnimationFrames(): void {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (presentationFrame) cancelAnimationFrame(presentationFrame);
    animationFrame = 0;
    presentationFrame = 0;
  }

  function releaseVideo(): void {
    seekInFlight = false;
    clearSeekTimer();

    video.pause();
    video.removeAttribute("src");
    video.load();
    mediaReady = false;
  }

  function removeVideoListeners(): void {
    window.removeEventListener("scroll", scheduleScrollUpdate);
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("orientationchange", handleResize);
    window.removeEventListener("pagehide", pauseForPageLifecycle);
    window.removeEventListener("pageshow", resumeFromPageLifecycle);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    video.removeEventListener("loadeddata", handleLoadedData);
    video.removeEventListener("seeked", handleSeeked);
    video.removeEventListener("error", handleMediaError);
    intersectionObserver?.disconnect();
    resizeObserver?.disconnect();
    intersectionObserver = null;
    resizeObserver = null;
  }

  function fallBackToFrames(): void {
    if (destroyed || usingFrameFallback) return;
    usingFrameFallback = true;
    clearFirstFrameTimer();
    cancelAnimationFrames();
    removeVideoListeners();
    releaseVideo();
    video.hidden = true;

    fallbackEngine = createFrameSequenceEngine(options);
    fallbackEngine.start();
  }

  function armFirstFrameTimeout(): void {
    clearFirstFrameTimer();
    if (hasRenderableFrame || destroyed || usingFrameFallback) return;
    firstFrameTimer = window.setTimeout(() => {
      firstFrameTimer = 0;
      if (!destroyed && !usingFrameFallback && !hasRenderableFrame) emit("degraded");
    }, FIRST_FRAME_TIMEOUT_MS);
  }

  function sequenceProgress(): number {
    const sectionBounds = section.getBoundingClientRect();
    const scrollDistance = Math.max(1, section.offsetHeight - stableViewportHeight);
    return clamp(-sectionBounds.top / scrollDistance);
  }

  function schedulePresentation(): void {
    if (presentationFrame || destroyed || usingFrameFallback || pagePaused) return;
    presentationFrame = requestAnimationFrame(() => {
      presentationFrame = 0;
      if (
        destroyed ||
        usingFrameFallback ||
        pagePaused ||
        video.readyState < 2 ||
        video.seeking
      ) {
        return;
      }

      presentedFrame = clamp(
        Math.floor(video.currentTime * source.framesPerSecond),
        0,
        source.frameCount - 1,
      );
      hasRenderableFrame = true;
      clearFirstFrameTimer();
      emit("ready");
      pumpSeek();
    });
  }

  function handleSeekTimeout(): void {
    seekTimer = 0;
    if (destroyed || usingFrameFallback) return;

    emit("degraded");
    if (video.seeking) {
      seekTimer = window.setTimeout(handleSeekTimeout, SEEK_TIMEOUT_MS);
      return;
    }

    seekInFlight = false;
    schedulePresentation();
    pumpSeek();
  }

  function pumpSeek(): void {
    if (
      destroyed ||
      usingFrameFallback ||
      pagePaused ||
      !nearSection ||
      !mediaReady ||
      video.readyState < 2 ||
      seekInFlight ||
      presentedFrame === targetFrame
    ) {
      return;
    }

    const targetTime = mediaTimeForFrame(
      targetFrame,
      source.frameCount,
      source.framesPerSecond,
      video.duration,
    );
    const halfFrame = 0.5 / source.framesPerSecond;
    if (Math.abs(video.currentTime - targetTime) < halfFrame * 0.5 && !video.seeking) {
      schedulePresentation();
      return;
    }

    seekInFlight = true;
    clearSeekTimer();
    seekTimer = window.setTimeout(handleSeekTimeout, SEEK_TIMEOUT_MS);

    try {
      video.currentTime = targetTime;
    } catch {
      clearSeekTimer();
      seekInFlight = false;
      fallBackToFrames();
    }
  }

  function updateFromScroll(): void {
    animationFrame = 0;
    if (destroyed || usingFrameFallback || pagePaused || !nearSection) return;
    targetFrame = frameIndexForProgress(sequenceProgress(), source.frameCount);
    pumpSeek();
  }

  function scheduleScrollUpdate(): void {
    if (animationFrame || destroyed || usingFrameFallback || pagePaused || !nearSection) {
      return;
    }
    animationFrame = requestAnimationFrame(updateFromScroll);
  }

  function handleLoadedData(): void {
    if (destroyed || usingFrameFallback) return;
    mediaReady = true;

    if (targetFrame === 0 && video.currentTime < 1 / source.framesPerSecond) {
      schedulePresentation();
    } else {
      pumpSeek();
    }
  }

  function handleSeeked(): void {
    if (destroyed || usingFrameFallback) return;
    clearSeekTimer();
    seekInFlight = false;
    schedulePresentation();
  }

  function handleMediaError(): void {
    fallBackToFrames();
  }

  function ensureVideoLoaded(): void {
    if (loadStarted || destroyed || usingFrameFallback) return;
    loadStarted = true;
    armFirstFrameTimeout();
    video.preload = "auto";
    video.src = resolveAssetUrl(source.src);
    video.load();
  }

  function activate(): void {
    if (destroyed || usingFrameFallback) return;
    nearSection = true;
    stableViewportHeight = Math.max(1, pin.getBoundingClientRect().height || window.innerHeight);
    ensureVideoLoaded();
    scheduleScrollUpdate();
  }

  function deactivate(): void {
    nearSection = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  function handleResize(): void {
    if (destroyed || usingFrameFallback) return;
    const nextWidth = window.innerWidth;
    stableViewportHeight = Math.max(1, pin.getBoundingClientRect().height || window.innerHeight);
    if (Math.abs(nextWidth - lastViewportWidth) >= 2) {
      lastViewportWidth = nextWidth;
      const nextTier = chooseTierName();
      if (nextTier !== currentTierName) {
        currentTierName = nextTier;
        emit(currentStatus);
      }
    }
    scheduleScrollUpdate();
  }

  function pauseForPageLifecycle(): void {
    pagePaused = true;
    cancelAnimationFrames();
    clearSeekTimer();
    seekInFlight = false;
    video.pause();
  }

  function resumeFromPageLifecycle(): void {
    pagePaused = document.hidden;
    if (pagePaused || destroyed || usingFrameFallback || !nearSection) return;
    stableViewportHeight = Math.max(1, pin.getBoundingClientRect().height || window.innerHeight);
    if (mediaReady) schedulePresentation();
    scheduleScrollUpdate();
  }

  function handleVisibilityChange(): void {
    if (document.hidden) pauseForPageLifecycle();
    else resumeFromPageLifecycle();
  }

  function start(): void {
    if (started || destroyed) return;
    started = true;
    video.muted = true;
    video.playsInline = true;
    emit("loading");

    window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });
    window.addEventListener("pagehide", pauseForPageLifecycle);
    window.addEventListener("pageshow", resumeFromPageLifecycle);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", handleMediaError);

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(pin);
    }

    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries.find((candidate) => candidate.target === section);
          if (!entry) return;
          if (entry.isIntersecting) activate();
          else deactivate();
        },
        { rootMargin: "175% 0px" },
      );
      intersectionObserver.observe(section);
    } else {
      activate();
    }
  }

  function destroy(): void {
    if (destroyed) return;
    destroyed = true;
    clearFirstFrameTimer();
    cancelAnimationFrames();
    removeVideoListeners();
    releaseVideo();
    fallbackEngine?.destroy();
    fallbackEngine = null;
  }

  return { start, destroy };
}

export function createSequenceEngine(options: SequenceEngineOptions): SequenceEngine {
  const source = options.manifest.video;
  if (!source || !supportsVideo(options.video, source)) {
    return createFrameSequenceEngine(options);
  }

  return createVideoSequenceEngine(options, source);
}
