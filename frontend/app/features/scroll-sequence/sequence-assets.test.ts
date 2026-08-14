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

const frameSets: Record<"full" | "mobile", FrameSetExpectation> = {
  full: {
    directory: join(
      process.cwd(),
      "public/images/generator-sequence-v3/frames",
    ),
    width: 1280,
    height: 720,
    byteBudget: 14_250_000,
  },
  mobile: {
    directory: join(
      process.cwd(),
      "public/images/generator-sequence-v3/mobile",
    ),
    width: 1080,
    height: 608,
    byteBudget: 9_600_000,
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
  "high-quality %s sequence assets",
  (_tierName, expectation) => {
    it("keeps the complete cadence, intrinsic size, uniqueness, and byte budget", () => {
      const frameNames = readdirSync(expectation.directory)
        .filter((name) => /^frame_\d{4}\.webp$/.test(name))
        .sort();

      expect(frameNames).toHaveLength(192);
      expect(frameNames.at(0)).toBe("frame_0001.webp");
      expect(frameNames.at(-1)).toBe("frame_0192.webp");

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

      expect(new Set(hashes).size).toBe(192);
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
