import {
  ByteLruCache,
  clamp,
  desiredFrameIndexes,
  frameIndexForProgress,
  frameUrl,
} from "./sequence-core";
import type {
  SequenceEngine,
  SequenceEngineOptions,
  SequenceSnapshot,
  SequenceTierName,
} from "./sequence-types";

interface NetworkInformationLike {
  effectiveType?: string;
}

interface NavigatorWithHints extends Navigator {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
}

interface DecodedFrame {
  source: CanvasImageSource;
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
  dispose: () => void;
}

interface EncodedFrame {
  blob: Blob;
  bytes: number;
  dispose: () => void;
}

interface ActiveLoad {
  controller: AbortController;
  generation: number;
}

const FIRST_FRAME_TIMEOUT_MS = 6_000;
const CONTEXT_RESTORE_TIMEOUT_MS = 2_000;
const FAILURE_WINDOW_SIZE = 20;
const MEBIBYTE = 1024 * 1024;

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function resolveAssetUrl(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  if (path.startsWith("/")) return new URL(path, window.location.origin).href;

  const meta = import.meta as ImportMeta & { env?: { BASE_URL?: string } };
  const configuredBase = meta.env?.BASE_URL ?? "/";
  const base = new URL(configuredBase, window.location.origin);
  return new URL(path, base).href;
}

function chooseTierName(): SequenceTierName {
  const hints = navigator as NavigatorWithHints;
  const effectiveType = hints.connection?.effectiveType;
  const hasSlowConnection = effectiveType === "slow-2g" || effectiveType === "2g";
  const hasLowMemory = typeof hints.deviceMemory === "number" && hints.deviceMemory <= 2;

  if (hasSlowConnection || hasLowMemory) return "lite";

  const mobileViewport = window.matchMedia("(max-width: 767px)").matches;
  return mobileViewport ? "mobile" : "full";
}

async function decodeBlob(blob: Blob, signal: AbortSignal): Promise<DecodedFrame> {
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(blob);
      if (signal.aborted) {
        bitmap.close();
        throw new DOMException("Aborted", "AbortError");
      }

      return {
        source: bitmap,
        blob,
        width: bitmap.width,
        height: bitmap.height,
        bytes: bitmap.width * bitmap.height * 4,
        dispose: () => bitmap.close(),
      };
    } catch (error) {
      if (signal.aborted || isAbortError(error)) throw error;
      // Some WebViews expose createImageBitmap but cannot decode WebP blobs.
      // Fall through to the guarded HTMLImageElement decoder.
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  const image = new Image();
  image.decoding = "async";

  const loaded = new Promise<void>((resolve, reject) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener("error", () => reject(new Error("Frame decode failed")), {
      once: true,
    });
  });

  image.src = objectUrl;

  try {
    if (typeof image.decode === "function") {
      try {
        await image.decode();
      } catch {
        await loaded;
      }
    } else {
      await loaded;
    }

    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    return {
      source: image,
      blob,
      width: image.naturalWidth,
      height: image.naturalHeight,
      bytes: image.naturalWidth * image.naturalHeight * 4,
      dispose: () => {
        image.removeAttribute("src");
        URL.revokeObjectURL(objectUrl);
      },
    };
  } catch (error) {
    image.removeAttribute("src");
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

async function fetchFrameBlob(url: string, signal: AbortSignal): Promise<Blob> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: "force-cache",
        credentials: "same-origin",
        signal,
      });

      if (!response.ok) throw new Error(`Frame request failed (${response.status})`);
      return await response.blob();
    } catch (error) {
      if (signal.aborted || isAbortError(error)) throw error;
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Frame request failed");
}

function drawContained(
  context: CanvasRenderingContext2D,
  frame: DecodedFrame,
  canvas: HTMLCanvasElement,
): void {
  const sourceWidth = frame.width;
  const sourceHeight = frame.height;

  const scale = Math.min(canvas.width / sourceWidth, canvas.height / sourceHeight);
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const x = Math.round((canvas.width - width) / 2);
  const y = Math.round((canvas.height - height) / 2);

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(frame.source, x, y, width, height);
}

export function createSequenceEngine(options: SequenceEngineOptions): SequenceEngine {
  const { section, pin, canvas, fallbackImage, manifest, onSnapshot } = options;

  let destroyed = false;
  let started = false;
  let terminalFallback = false;
  let nearSection = false;
  let pagePaused = document.hidden;
  let contextLost = false;
  let contextLossCount = 0;
  let usingImageRenderer = false;
  let hasDrawnFrame = false;
  let currentTierName = chooseTierName();
  let tier = manifest.tiers[currentTierName];
  let cache = new ByteLruCache<DecodedFrame>(tier.cacheBudgetBytes);
  let encodedCache = new ByteLruCache<EncodedFrame>(
    Math.max(4 * MEBIBYTE, Math.floor(tier.cacheBudgetBytes / 2)),
  );
  let queue: number[] = [];
  let desired = new Set<number>();
  let targetFrame = 0;
  let renderedFrame: number | null = null;
  let direction: -1 | 1 = 1;
  let loadGeneration = 0;
  let animationFrame = 0;
  let orientationTimer = 0;
  let firstFrameTimer = 0;
  let contextRestoreTimer = 0;
  let fallbackRequestGeneration = 0;
  let fallbackLoadCleanup: (() => void) | null = null;
  let stableViewportHeight = Math.max(1, pin.getBoundingClientRect().height || window.innerHeight);
  let lastViewportWidth = window.innerWidth;
  let lastViewportHeight = stableViewportHeight;
  let lastSnapshot: SequenceSnapshot | null = null;
  let failureOutcomes: boolean[] = [];
  let consecutiveTargetFailures = 0;
  let context = canvas.getContext("2d", { alpha: false });
  const activeLoads = new Map<number, ActiveLoad>();

  let intersectionObserver: IntersectionObserver | null = null;
  let resizeObserver: ResizeObserver | null = null;

  function emit(status: SequenceSnapshot["status"]): void {
    const next = {
      status,
      tier: status === "static" ? null : currentTierName,
      hasRenderableFrame: hasDrawnFrame,
    };
    if (
      lastSnapshot?.status === next.status &&
      lastSnapshot.tier === next.tier &&
      lastSnapshot.hasRenderableFrame === next.hasRenderableFrame
    ) {
      return;
    }
    lastSnapshot = next;
    if (!destroyed) onSnapshot(next);
  }

  function cancelScheduledFrame(): void {
    if (!animationFrame) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  function abortLoads(): void {
    queue = [];
    for (const load of activeLoads.values()) load.controller.abort();
  }

  function clearFirstFrameTimer(): void {
    if (!firstFrameTimer) return;
    window.clearTimeout(firstFrameTimer);
    firstFrameTimer = 0;
  }

  function showPoster(asError = false): void {
    terminalFallback = true;
    abortLoads();
    cache.clear();
    encodedCache.clear();
    desired.clear();
    fallbackLoadCleanup?.();
    fallbackLoadCleanup = null;
    if (!hasDrawnFrame) {
      canvas.hidden = true;
      fallbackImage.hidden = true;
    }
    clearFirstFrameTimer();
    emit(asError ? "error" : "static");
  }

  function recordOutcome(index: number, succeeded: boolean): void {
    failureOutcomes.push(succeeded);
    if (failureOutcomes.length > FAILURE_WINDOW_SIZE) failureOutcomes.shift();

    if (index === targetFrame) {
      consecutiveTargetFailures = succeeded ? 0 : consecutiveTargetFailures + 1;
    }

    const failures = failureOutcomes.filter((outcome) => !outcome).length;
    const excessiveFailures =
      failureOutcomes.length >= 10 && failures / failureOutcomes.length > 0.1;

    if (!succeeded && (consecutiveTargetFailures >= 3 || excessiveFailures)) {
      failureOutcomes = [];
      consecutiveTargetFailures = 0;
      showPoster(true);
    }
  }

  function protectedCacheKeys(): Set<number> {
    const keys = new Set([targetFrame]);
    if (renderedFrame !== null) keys.add(renderedFrame);
    return keys;
  }

  function resizeCanvas(): void {
    if (destroyed || usingImageRenderer) return;
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;

    const deviceRatio = Math.min(window.devicePixelRatio || 1, tier.maxDevicePixelRatio);
    const sourceRatioLimit = Math.min(
      tier.width / bounds.width,
      tier.height / bounds.height,
    );
    const pixelRatio = Math.max(0.25, Math.min(deviceRatio, sourceRatioLimit));
    const width = Math.max(1, Math.round(bounds.width * pixelRatio));
    const height = Math.max(1, Math.round(bounds.height * pixelRatio));
    if (canvas.width === width && canvas.height === height) return;

    canvas.width = width;
    canvas.height = height;
    if (renderedFrame !== null) drawBestFrame(true);
  }

  function renderFallbackImage(blob: Blob, index: number): void {
    const requestGeneration = ++fallbackRequestGeneration;
    if (
      renderedFrame === index &&
      fallbackImage.complete &&
      fallbackImage.naturalWidth > 0
    ) {
      fallbackImage.hidden = false;
      canvas.hidden = true;
      renderedFrame = index;
      hasDrawnFrame = true;
      clearFirstFrameTimer();
      emit("ready");
      return;
    }

    fallbackLoadCleanup?.();
    const objectUrl = URL.createObjectURL(blob);

    const cleanup = () => {
      fallbackImage.removeEventListener("load", handleLoad);
      fallbackImage.removeEventListener("error", handleError);
      URL.revokeObjectURL(objectUrl);
      if (fallbackLoadCleanup === cleanup) fallbackLoadCleanup = null;
    };
    const handleLoad = () => {
      cleanup();
      if (destroyed || requestGeneration !== fallbackRequestGeneration) return;
      fallbackImage.hidden = false;
      canvas.hidden = true;
      renderedFrame = index;
      hasDrawnFrame = true;
      clearFirstFrameTimer();
      emit("ready");
    };
    const handleError = () => {
      cleanup();
      if (destroyed || requestGeneration !== fallbackRequestGeneration) return;
      recordOutcome(index, false);
    };
    fallbackLoadCleanup = cleanup;
    fallbackImage.addEventListener("load", handleLoad, { once: true });
    fallbackImage.addEventListener("error", handleError, { once: true });
    fallbackImage.src = objectUrl;
  }

  function selectImageRenderer(): void {
    if (usingImageRenderer) return;
    usingImageRenderer = true;
    contextLost = false;
    context = null;
    emit("degraded");
    drawBestFrame(true);
  }

  function bestCachedIndex(): number | null {
    if (cache.has(targetFrame)) return targetFrame;

    const keys = cache.keys();
    if (keys.length === 0) return null;
    const directionalKeys = keys.filter((key) =>
      direction > 0 ? key <= targetFrame : key >= targetFrame,
    );
    const candidates = directionalKeys.length > 0 ? directionalKeys : keys;
    candidates.sort((a, b) => Math.abs(a - targetFrame) - Math.abs(b - targetFrame));

    for (const candidate of candidates) {
      if (renderedFrame === null) return candidate;
      if (direction > 0 && candidate >= renderedFrame) return candidate;
      if (direction < 0 && candidate <= renderedFrame) return candidate;
    }

    return renderedFrame !== null && cache.has(renderedFrame) ? renderedFrame : null;
  }

  function drawBestFrame(force = false): void {
    if (destroyed || contextLost) return;
    const candidate = bestCachedIndex();
    if (candidate === null || (!force && candidate === renderedFrame)) return;
    const frame = cache.get(candidate);
    if (!frame) return;

    if (usingImageRenderer || !context) {
      renderFallbackImage(frame.blob, candidate);
      return;
    }

    try {
      canvas.hidden = false;
      fallbackImage.hidden = true;
      drawContained(context, frame, canvas);
      renderedFrame = candidate;
      hasDrawnFrame = true;
      clearFirstFrameTimer();
      emit("ready");
    } catch {
      selectImageRenderer();
    }
  }

  function isUsefulLoad(index: number): boolean {
    const retentionRadius = tier.preloadAhead + tier.preloadBehind + 3;
    return Math.abs(index - targetFrame) <= retentionRadius;
  }

  async function loadFrame(
    index: number,
    url: string,
    signal: AbortSignal,
    generation: number,
  ): Promise<DecodedFrame | null> {
    let encoded = encodedCache.get(index);
    if (!encoded) {
      const blob = await fetchFrameBlob(url, signal);
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");

      encoded = { blob, bytes: blob.size, dispose: () => undefined };
      encodedCache.set(index, encoded, new Set([index, targetFrame]));
    }

    if (
      destroyed ||
      signal.aborted ||
      generation !== loadGeneration ||
      !isUsefulLoad(index)
    ) {
      return null;
    }

    try {
      return await decodeBlob(encoded.blob, signal);
    } catch (error) {
      if (!signal.aborted && !isAbortError(error)) encodedCache.delete(index);
      throw error;
    }
  }

  function pumpQueue(): void {
    if (destroyed || terminalFallback || pagePaused || !nearSection) return;

    while (activeLoads.size < tier.concurrency && queue.length > 0) {
      const index = queue.shift();
      if (index === undefined || cache.has(index) || activeLoads.has(index)) continue;

      const controller = new AbortController();
      const generation = loadGeneration;
      activeLoads.set(index, { controller, generation });
      const url = resolveAssetUrl(frameUrl(tier, index));
      let hardFailed = false;

      void loadFrame(index, url, controller.signal, generation)
        .then((frame) => {
          if (!frame) return;
          if (
            destroyed ||
            controller.signal.aborted ||
            generation !== loadGeneration ||
            !isUsefulLoad(index)
          ) {
            frame.dispose();
            return;
          }

          cache.set(index, frame, protectedCacheKeys());
          recordOutcome(index, true);
          drawBestFrame();
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted && !isAbortError(error) && !destroyed) {
            hardFailed = true;
            recordOutcome(index, false);
            drawBestFrame();
          }
        })
        .finally(() => {
          const currentLoad = activeLoads.get(index);
          if (currentLoad?.controller === controller) {
            activeLoads.delete(index);
            if (
              !destroyed &&
              !terminalFallback &&
              !hardFailed &&
              desired.has(index) &&
              !cache.has(index) &&
              !queue.includes(index)
            ) {
              queue.unshift(index);
            }
          }
          pumpQueue();
        });
    }
  }

  function requestWorkingSet(nextTarget: number): void {
    if (destroyed || terminalFallback) return;
    const clampedTarget = clamp(nextTarget, 0, tier.frameCount - 1);
    if (clampedTarget > targetFrame) direction = 1;
    if (clampedTarget < targetFrame) direction = -1;
    targetFrame = clampedTarget;

    const ordered = desiredFrameIndexes(targetFrame, direction, tier);
    desired = new Set(ordered);
    queue = ordered.filter((index) => !cache.has(index) && !activeLoads.has(index));

    cache.evict(protectedCacheKeys());
    drawBestFrame();
    pumpQueue();
  }

  function sequenceProgress(): number {
    const sectionBounds = section.getBoundingClientRect();
    const scrollDistance = Math.max(1, section.offsetHeight - stableViewportHeight);
    return clamp(-sectionBounds.top / scrollDistance);
  }

  function updateFromScroll(): void {
    animationFrame = 0;
    if (destroyed || pagePaused || !nearSection) return;
    requestWorkingSet(frameIndexForProgress(sequenceProgress(), tier.frameCount));
  }

  function scheduleScrollUpdate(): void {
    if (animationFrame || destroyed || terminalFallback || pagePaused || !nearSection) return;
    animationFrame = requestAnimationFrame(updateFromScroll);
  }

  function armFirstFrameTimeout(): void {
    clearFirstFrameTimer();
    if (terminalFallback || hasDrawnFrame || !nearSection || pagePaused) return;
    firstFrameTimer = window.setTimeout(() => {
      firstFrameTimer = 0;
      if (!destroyed && !hasDrawnFrame) emit("degraded");
    }, FIRST_FRAME_TIMEOUT_MS);
  }

  function switchTier(nextTierName: SequenceTierName): void {
    if (destroyed || terminalFallback) return;
    loadGeneration += 1;
    abortLoads();
    cache.clear();
    encodedCache.clear();
    desired.clear();
    failureOutcomes = [];
    consecutiveTargetFailures = 0;
    renderedFrame = null;
    hasDrawnFrame = false;

    currentTierName = nextTierName;
    tier = manifest.tiers[currentTierName];
    cache = new ByteLruCache<DecodedFrame>(tier.cacheBudgetBytes);
    encodedCache = new ByteLruCache<EncodedFrame>(
      Math.max(4 * MEBIBYTE, Math.floor(tier.cacheBudgetBytes / 2)),
    );
    resizeCanvas();
    emit("loading");
    armFirstFrameTimeout();
    requestWorkingSet(frameIndexForProgress(sequenceProgress(), tier.frameCount));
  }

  function applyCapabilityTier(): void {
    const selected = chooseTierName();
    if (selected === currentTierName) return;

    const current = manifest.tiers[currentTierName];
    const next = manifest.tiers[selected];
    const sharesFrameSet =
      current.framePath === next.framePath &&
      current.frameCount === next.frameCount &&
      current.frameStart === next.frameStart;

    if (sharesFrameSet) return;
    switchTier(selected);
  }

  function activate(): void {
    if (destroyed || terminalFallback || pagePaused) return;
    nearSection = true;
    stableViewportHeight = Math.max(1, pin.getBoundingClientRect().height || window.innerHeight);
    lastViewportHeight = stableViewportHeight;
    resizeCanvas();
    armFirstFrameTimeout();
    scheduleScrollUpdate();
  }

  function deactivate(): void {
    nearSection = false;
    cancelScheduledFrame();
    clearFirstFrameTimer();
    abortLoads();
  }

  function pauseForPageLifecycle(): void {
    pagePaused = true;
    cancelScheduledFrame();
    clearFirstFrameTimer();
    abortLoads();
  }

  function resumeFromPageLifecycle(): void {
    pagePaused = document.hidden;
    if (pagePaused || !nearSection) return;
    stableViewportHeight = Math.max(1, pin.getBoundingClientRect().height || window.innerHeight);
    lastViewportHeight = stableViewportHeight;
    resizeCanvas();
    armFirstFrameTimeout();
    scheduleScrollUpdate();
  }

  function handleVisibilityChange(): void {
    if (document.hidden) pauseForPageLifecycle();
    else resumeFromPageLifecycle();
  }

  function handleMeaningfulResize(): void {
    const nextWidth = window.innerWidth;
    const nextHeight = Math.max(1, pin.getBoundingClientRect().height || window.innerHeight);
    const widthChanged = Math.abs(nextWidth - lastViewportWidth) >= 2;
    const heightChanged = Math.abs(nextHeight - lastViewportHeight) >= 2;
    if (!widthChanged && !heightChanged) return;
    lastViewportWidth = nextWidth;
    lastViewportHeight = nextHeight;
    stableViewportHeight = nextHeight;
    if (widthChanged) applyCapabilityTier();
    resizeCanvas();
    scheduleScrollUpdate();
  }

  function handleObservedResize(): void {
    resizeCanvas();
    scheduleScrollUpdate();
  }

  function handleOrientationChange(): void {
    window.clearTimeout(orientationTimer);
    orientationTimer = window.setTimeout(() => {
      orientationTimer = 0;
      lastViewportWidth = window.innerWidth;
      stableViewportHeight = Math.max(1, pin.getBoundingClientRect().height || window.innerHeight);
      lastViewportHeight = stableViewportHeight;
      applyCapabilityTier();
      resizeCanvas();
      scheduleScrollUpdate();
    }, 160);
  }

  function handleContextLost(event: Event): void {
    event.preventDefault();
    contextLost = true;
    contextLossCount += 1;
    emit("degraded");

    if (contextLossCount > 1) {
      selectImageRenderer();
      return;
    }

    window.clearTimeout(contextRestoreTimer);
    contextRestoreTimer = window.setTimeout(() => {
      contextRestoreTimer = 0;
      if (!destroyed && contextLost) selectImageRenderer();
    }, CONTEXT_RESTORE_TIMEOUT_MS);
  }

  function handleContextRestored(): void {
    if (destroyed || usingImageRenderer) return;
    window.clearTimeout(contextRestoreTimer);
    contextRestoreTimer = 0;
    contextLost = false;
    context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      selectImageRenderer();
      return;
    }
    resizeCanvas();
    drawBestFrame(true);
  }

  function start(): void {
    if (started || destroyed) return;
    started = true;
    emit("loading");

    if (!context) selectImageRenderer();

    window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
    window.addEventListener("resize", handleMeaningfulResize, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange, {
      passive: true,
    });
    window.addEventListener("pagehide", pauseForPageLifecycle);
    window.addEventListener("pageshow", resumeFromPageLifecycle);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    canvas.addEventListener("contextlost", handleContextLost);
    canvas.addEventListener("contextrestored", handleContextRestored);

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(handleObservedResize);
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
        { rootMargin: "100% 0px" },
      );
      intersectionObserver.observe(section);
    } else {
      activate();
    }
  }

  function destroy(): void {
    if (destroyed) return;
    destroyed = true;
    loadGeneration += 1;
    cancelScheduledFrame();
    abortLoads();
    cache.clear();
    encodedCache.clear();
    desired.clear();
    clearFirstFrameTimer();
    window.clearTimeout(orientationTimer);
    window.clearTimeout(contextRestoreTimer);
    fallbackRequestGeneration += 1;
    fallbackLoadCleanup?.();
    fallbackLoadCleanup = null;
    fallbackImage.removeAttribute("src");

    intersectionObserver?.disconnect();
    resizeObserver?.disconnect();
    intersectionObserver = null;
    resizeObserver = null;

    window.removeEventListener("scroll", scheduleScrollUpdate);
    window.removeEventListener("resize", handleMeaningfulResize);
    window.removeEventListener("orientationchange", handleOrientationChange);
    window.removeEventListener("pagehide", pauseForPageLifecycle);
    window.removeEventListener("pageshow", resumeFromPageLifecycle);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    canvas.removeEventListener("contextlost", handleContextLost);
    canvas.removeEventListener("contextrestored", handleContextRestored);
  }

  return { start, destroy };
}
