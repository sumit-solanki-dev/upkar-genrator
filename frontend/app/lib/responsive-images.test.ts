import { describe, expect, it } from "vitest";

import { productImageSrcSet } from "./responsive-images";

describe("responsive product image sources", () => {
  it("maps catalog frames to optimized candidates while retaining the source", () => {
    const srcSet = productImageSrcSet("/images/sequence/frame_0030.webp");

    expect(srcSet).toContain("frame_0030-256.webp 256w");
    expect(srcSet).toContain("frame_0030-768.webp 768w");
    expect(srcSet).toContain("/images/sequence/frame_0030.webp 1280w");
  });

  it("leaves unknown image sources alone", () => {
    expect(productImageSrcSet("/images/generator-hero.svg")).toBeUndefined();
  });
});
