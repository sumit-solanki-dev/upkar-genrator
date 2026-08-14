export type SequenceTierName = "lite" | "mobile" | "full";

export type SequenceRenderer = "video" | "frames";

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

export interface SequenceVideo {
  src: string;
  type: string;
  codec: string;
  width: number;
  height: number;
  frameCount: number;
  framesPerSecond: number;
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
  video?: SequenceVideo;
  tiers: Record<SequenceTierName, SequenceTier>;
}

export interface SequenceSnapshot {
  status: SequenceStatus;
  tier: SequenceTierName | null;
  hasRenderableFrame: boolean;
  renderer: SequenceRenderer | null;
}

export interface SequenceElements {
  section: HTMLElement;
  pin: HTMLElement;
  video: HTMLVideoElement;
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
