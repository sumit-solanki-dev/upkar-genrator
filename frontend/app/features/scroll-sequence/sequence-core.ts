import type { SequenceTier } from "./sequence-types";

export function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function frameIndexForProgress(progress: number, frameCount: number): number {
  if (frameCount <= 1) return 0;
  return Math.round(clamp(progress) * (frameCount - 1));
}

export function frameUrl(tier: SequenceTier, index: number): string {
  const frameNumber = tier.frameStart + clamp(Math.round(index), 0, tier.frameCount - 1);
  const paddedFrame = String(frameNumber).padStart(tier.framePad, "0");

  return tier.framePath
    .split("{frame}")
    .join(paddedFrame)
    .split("{index}")
    .join(String(frameNumber));
}

/**
 * Returns a small, ordered working set. The exact frame is always first, then
 * frames in the direction of travel, followed by the short trailing window.
 */
export function desiredFrameIndexes(
  target: number,
  direction: -1 | 1,
  tier: SequenceTier,
): number[] {
  const ordered = [target];

  for (let distance = 1; distance <= tier.preloadAhead; distance += 1) {
    ordered.push(target + distance * direction);
  }

  for (let distance = 1; distance <= tier.preloadBehind; distance += 1) {
    ordered.push(target - distance * direction);
  }

  return [...new Set(ordered)].filter(
    (index) => index >= 0 && index < tier.frameCount,
  );
}

export interface CacheValue {
  bytes: number;
  dispose: () => void;
}

/** A byte-bounded LRU whose Map iteration order is oldest to newest. */
export class ByteLruCache<T extends CacheValue> {
  readonly #entries = new Map<number, T>();
  #bytes = 0;

  constructor(readonly budgetBytes: number) {}

  get size(): number {
    return this.#entries.size;
  }

  get bytes(): number {
    return this.#bytes;
  }

  has(key: number): boolean {
    return this.#entries.has(key);
  }

  peek(key: number): T | undefined {
    return this.#entries.get(key);
  }

  get(key: number): T | undefined {
    const value = this.#entries.get(key);
    if (!value) return undefined;

    this.#entries.delete(key);
    this.#entries.set(key, value);
    return value;
  }

  keys(): number[] {
    return [...this.#entries.keys()];
  }

  set(key: number, value: T, protectedKeys: ReadonlySet<number> = new Set()): void {
    const previous = this.#entries.get(key);
    if (previous) {
      this.#entries.delete(key);
      this.#bytes -= previous.bytes;
      previous.dispose();
    }

    this.#entries.set(key, value);
    this.#bytes += value.bytes;
    this.evict(protectedKeys);
  }

  evict(protectedKeys: ReadonlySet<number>): void {
    if (this.#bytes <= this.budgetBytes) return;

    for (const [key, value] of this.#entries) {
      if (this.#bytes <= this.budgetBytes) break;
      if (protectedKeys.has(key)) continue;

      this.#entries.delete(key);
      this.#bytes -= value.bytes;
      value.dispose();
    }
  }

  clear(): void {
    for (const value of this.#entries.values()) value.dispose();
    this.#entries.clear();
    this.#bytes = 0;
  }
}
