import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

interface FrameSetExpectation {
  directory: string;
  width: number;
  height: number;
  byteBudget: number;
}

const frameSets: Record<"fallback", FrameSetExpectation> = {
  fallback: {
    directory: join(
      process.cwd(),
      "public/images/generator-sequence-v2/mobile",
    ),
    width: 960,
    height: 540,
    byteBudget: 2_100_000,
  },
};

function dimensionsOfLossyWebp(contents: Buffer): {
  width: number;
  height: number;
} {
  expect(contents.toString("ascii", 0, 4)).toBe("RIFF");
  expect(contents.toString("ascii", 8, 12)).toBe("WEBP");

  const frameHeader = contents.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
  if (frameHeader < 0) throw new Error("Expected a lossy VP8 frame header");

  return {
    width: contents.readUInt16LE(frameHeader + 3) & 0x3fff,
    height: contents.readUInt16LE(frameHeader + 5) & 0x3fff,
  };
}

describe.each(Object.entries(frameSets))(
  "%s sequence assets",
  (_tierName, expectation) => {
    it("keeps the complete cadence, intrinsic size, uniqueness, and byte budget", () => {
      const frameNames = readdirSync(expectation.directory)
        .filter((name) => /^frame_\d{3}\.webp$/.test(name))
        .sort();

      expect(frameNames).toHaveLength(108);
      expect(frameNames.at(0)).toBe("frame_000.webp");
      expect(frameNames.at(-1)).toBe("frame_107.webp");

      const contents = frameNames.map((name) =>
        readFileSync(join(expectation.directory, name)),
      );
      const hashes = contents.map((frame) =>
        createHash("sha256").update(frame).digest("hex"),
      );
      const aggregateBytes = frameNames.reduce(
        (sum, name) => sum + statSync(join(expectation.directory, name)).size,
        0,
      );

      expect(new Set(hashes).size).toBe(108);
      expect(aggregateBytes).toBeLessThanOrEqual(expectation.byteBudget);

      for (const frame of contents) {
        expect(dimensionsOfLossyWebp(frame)).toEqual({
          width: expectation.width,
          height: expectation.height,
        });
      }
    });
  },
);

describe("packed scroll sequence", () => {
  it("keeps all 192 samples in a fast-start H.264 file near two megabytes", () => {
    const videoPath = join(
      process.cwd(),
      "public/images/generator-sequence-v4/generator-scroll.mp4",
    );
    const contents = readFileSync(videoPath);
    const moovOffset = contents.indexOf("moov");
    const mediaOffset = contents.indexOf("mdat");
    const sampleSizeOffset = contents.indexOf("stsz");

    expect(contents.toString("ascii", 4, 8)).toBe("ftyp");
    expect(contents.indexOf("avc1")).toBeGreaterThan(0);
    expect(moovOffset).toBeGreaterThan(0);
    expect(mediaOffset).toBeGreaterThan(moovOffset);
    expect(sampleSizeOffset).toBeGreaterThan(0);
    expect(contents.readUInt32BE(sampleSizeOffset + 12)).toBe(192);
    expect(statSync(videoPath).size).toBeLessThanOrEqual(2_020_000);
  });
});
