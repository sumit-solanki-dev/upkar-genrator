import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ScrollSequence } from "./scroll-sequence";

describe("ScrollSequence server rendering", () => {
  it("renders an accessible poster without reading browser APIs", () => {
    const markup = renderToStaticMarkup(<ScrollSequence />);

    expect(markup).toContain("UPKAR enclosed industrial diesel generator");
    expect(markup).toContain("generator-sequence-v3/poster.webp");
    expect(markup).toContain("data-sequence-status=\"idle\"");
    expect(markup).toContain("data-sequence-renderer=\"poster\"");
    expect(markup).toContain("data-sequence-renderable=\"false\"");
    expect(markup).toContain("<video");
    expect(markup).toContain("preload=\"none\"");
    expect(markup).not.toContain("generator-scroll-compressed.mp4");
    expect(markup).toContain("<canvas");
    expect(markup).toContain("aria-hidden=\"true\"");
  });
});
