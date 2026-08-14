import { describe, expect, it, vi } from "vitest";

import {
  ByteLruCache,
  desiredFrameIndexes,
  frameIndexForProgress,
  frameUrl,
} from "./sequence-core";
import { generatorSequenceManifest } from "./sequence-manifest";
import type { CacheValue } from "./sequence-core";
import type { SequenceTier } from "./sequence-types";

const tier: SequenceTier = {
  name: "mobile",
  frameCount: 108,
  frameStart: 0,
  framePad: 3,
  framePath: "/frames/frame_{frame}.webp?source={index}",
  width: 960,
  height: 540,
  cacheBudgetBytes: 32,
  concurrency: 3,
  preloadAhead: 3,
  preloadBehind: 2,
  maxDevicePixelRatio: 1.5,
};

describe("sequence frame mapping", () => {
  it("keeps the normal mobile tier device-sharp and at full frame cadence", () => {
    const mobile = generatorSequenceManifest.tiers.mobile;

    expect(mobile.frameCount).toBe(192);
    expect(mobile.width).toBe(1080);
    expect(mobile.height).toBe(608);
    expect(mobile.framePath).toContain(
      "images/generator-sequence-v3/mobile/frame_{frame}.webp",
    );
    expect(mobile.maxDevicePixelRatio).toBeGreaterThanOrEqual(2.5);
    expect(mobile.preloadAhead).toBeGreaterThanOrEqual(6);
  });

  it("maps clamped progress to both endpoint frames", () => {
    expect(frameIndexForProgress(-1, 108)).toBe(0);
    expect(frameIndexForProgress(0.5, 108)).toBe(54);
    expect(frameIndexForProgress(2, 108)).toBe(107);
  });

  it("creates deterministic, padded frame URLs without replaceAll", () => {
    expect(frameUrl(tier, 7)).toBe("/frames/frame_007.webp?source=7");
    expect(frameUrl(tier, 500)).toBe("/frames/frame_107.webp?source=107");
  });

  it("prioritizes the target, travel direction, then the trailing window", () => {
    expect(desiredFrameIndexes(10, 1, tier)).toEqual([10, 11, 12, 13, 9, 8]);
    expect(desiredFrameIndexes(1, -1, tier)).toEqual([1, 0, 2, 3]);
  });
});

describe("ByteLruCache", () => {
  function entry(bytes: number, dispose = vi.fn()): CacheValue {
    return { bytes, dispose };
  }

  it("evicts least-recently-used entries to remain inside the byte budget", () => {
    const cache = new ByteLruCache<CacheValue>(10);
    const firstDispose = vi.fn();
    const secondDispose = vi.fn();

    cache.set(1, entry(4, firstDispose));
    cache.set(2, entry(4, secondDispose));
    cache.get(1);
    cache.set(3, entry(4));

    expect(cache.keys()).toEqual([1, 3]);
    expect(cache.bytes).toBe(8);
    expect(firstDispose).not.toHaveBeenCalled();
    expect(secondDispose).toHaveBeenCalledOnce();
  });

  it("protects the displayed/target entries and disposes everything on clear", () => {
    const cache = new ByteLruCache<CacheValue>(5);
    const protectedDispose = vi.fn();
    const extraDispose = vi.fn();

    cache.set(1, entry(5, protectedDispose));
    cache.set(2, entry(5, extraDispose), new Set([1]));

    expect(cache.keys()).toEqual([1]);
    expect(extraDispose).toHaveBeenCalledOnce();

    cache.clear();
    expect(protectedDispose).toHaveBeenCalledOnce();
    expect(cache.bytes).toBe(0);
  });

  it("removes and disposes a single cached entry", () => {
    const cache = new ByteLruCache<CacheValue>(10);
    const dispose = vi.fn();

    cache.set(1, entry(4, dispose));

    expect(cache.delete(1)).toBe(true);
    expect(cache.delete(1)).toBe(false);
    expect(cache.size).toBe(0);
    expect(cache.bytes).toBe(0);
    expect(dispose).toHaveBeenCalledOnce();
  });
});
