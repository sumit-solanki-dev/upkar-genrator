import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const frameDirectory = join(
  process.cwd(),
  "public/images/generator-sequence-v3/frames",
);

describe("high-quality sequence assets", () => {
  it("contains a complete, duplicate-free constant-cadence frame set", () => {
    const frameNames = readdirSync(frameDirectory)
      .filter((name) => /^frame_\d{4}\.webp$/.test(name))
      .sort();

    expect(frameNames).toHaveLength(192);
    expect(frameNames.at(0)).toBe("frame_0001.webp");
    expect(frameNames.at(-1)).toBe("frame_0192.webp");

    const hashes = frameNames.map((name) =>
      createHash("sha256").update(readFileSync(join(frameDirectory, name))).digest("hex"),
    );

    for (let index = 1; index < hashes.length; index += 1) {
      expect(hashes[index]).not.toBe(hashes[index - 1]);
    }
  });
});
