import type { SequenceManifest } from "./sequence-types";

const MEBIBYTE = 1024 * 1024;
const PUBLIC_BASE_URL = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

function publicAsset(path: string): string {
  return `${PUBLIC_BASE_URL}${path.replace(/^\/+/, "")}`;
}

export const generatorSequenceManifest: SequenceManifest = {
  poster: {
    src: publicAsset("images/generator-sequence-v3/poster.webp"),
    width: 1280,
    height: 720,
    alt: "UPKAR enclosed industrial diesel generator",
  },
  video: {
    src: publicAsset("images/generator-sequence-v4/generator-scroll.mp4"),
    type: "video/mp4",
    codec: "avc1.640028",
    width: 1280,
    height: 720,
    frameCount: 192,
    framesPerSecond: 24,
  },
  tiers: {
    lite: {
      name: "lite",
      frameCount: 108,
      frameStart: 0,
      framePad: 3,
      framePath: publicAsset("images/generator-sequence-v2/mobile/frame_{frame}.webp"),
      width: 960,
      height: 540,
      cacheBudgetBytes: 20 * MEBIBYTE,
      concurrency: 2,
      preloadAhead: 5,
      preloadBehind: 1,
      maxDevicePixelRatio: 1.5,
    },
    mobile: {
      name: "mobile",
      frameCount: 108,
      frameStart: 0,
      framePad: 3,
      framePath: publicAsset("images/generator-sequence-v2/mobile/frame_{frame}.webp"),
      width: 960,
      height: 540,
      cacheBudgetBytes: 20 * MEBIBYTE,
      concurrency: 2,
      preloadAhead: 5,
      preloadBehind: 1,
      maxDevicePixelRatio: 1.5,
    },
    full: {
      name: "full",
      frameCount: 108,
      frameStart: 0,
      framePad: 3,
      framePath: publicAsset("images/generator-sequence-v2/mobile/frame_{frame}.webp"),
      width: 960,
      height: 540,
      cacheBudgetBytes: 20 * MEBIBYTE,
      concurrency: 2,
      preloadAhead: 5,
      preloadBehind: 1,
      maxDevicePixelRatio: 1.5,
    },
  },
};
