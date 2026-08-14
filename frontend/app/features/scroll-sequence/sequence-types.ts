export type SequenceTierName = "lite" | "mobile" | "full";

export type SequenceStatus =
  | "idle"
  | "loading"
  | "ready"
  | "degraded"
  | "static"
  | "error";

export interface SequencePoster {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface SequenceTier {
  name: SequenceTierName;
  frameCount: number;
  frameStart: number;
  framePad: number;
  framePath: string;
  width: number;
  height: number;
  cacheBudgetBytes: number;
  concurrency: number;
  preloadAhead: number;
  preloadBehind: number;
  maxDevicePixelRatio: number;
}

export interface SequenceManifest {
  poster: SequencePoster;
  tiers: Record<SequenceTierName, SequenceTier>;
}

export interface SequenceSnapshot {
  status: SequenceStatus;
  tier: SequenceTierName | null;
  hasRenderableFrame: boolean;
}

export interface SequenceElements {
  section: HTMLElement;
  pin: HTMLElement;
  canvas: HTMLCanvasElement;
  fallbackImage: HTMLImageElement;
}

export interface SequenceEngineOptions extends SequenceElements {
  manifest: SequenceManifest;
  onSnapshot: (snapshot: SequenceSnapshot) => void;
}

export interface SequenceEngine {
  start: () => void;
  destroy: () => void;
}
