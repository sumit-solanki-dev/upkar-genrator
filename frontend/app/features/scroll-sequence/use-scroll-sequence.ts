import { useEffect, useRef, useState } from "react";

import type {
  SequenceEngine,
  SequenceManifest,
  SequenceSnapshot,
} from "./sequence-types";
import { createSequenceEngine } from "./sequence-video-engine.client";

interface NetworkInformationLike extends EventTarget {
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformationLike;
}

const INITIAL_SNAPSHOT: SequenceSnapshot = {
  status: "idle",
  tier: null,
  hasRenderableFrame: false,
  renderer: null,
};

export function useScrollSequence(manifest: SequenceManifest) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackImageRef = useRef<HTMLImageElement>(null);
  const [snapshot, setSnapshot] = useState<SequenceSnapshot>(INITIAL_SNAPSHOT);

  useEffect(() => {
    let disposed = false;
    let engine: SequenceEngine | null = null;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as NavigatorWithConnection).connection;
    const shouldStayStatic = () => reducedMotion.matches || connection?.saveData === true;
    let previousStaticPolicy = shouldStayStatic();

    const safelySetSnapshot = (nextSnapshot: SequenceSnapshot) => {
      if (!disposed) setSnapshot(nextSnapshot);
    };

    const boot = () => {
      engine?.destroy();
      engine = null;

      if (shouldStayStatic()) {
        safelySetSnapshot({
          status: "static",
          tier: null,
          hasRenderableFrame: false,
          renderer: null,
        });
        return;
      }

      const section = sectionRef.current;
      const pin = pinRef.current;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const fallbackImage = fallbackImageRef.current;

      if (!section || !pin || !video || !canvas || !fallbackImage) {
        safelySetSnapshot({
          status: "static",
          tier: null,
          hasRenderableFrame: false,
          renderer: null,
        });
        return;
      }

      safelySetSnapshot({
        status: "loading",
        tier: null,
        hasRenderableFrame: false,
        renderer: null,
      });

      try {
        if (disposed) return;

        engine = createSequenceEngine({
          section,
          pin,
          video,
          canvas,
          fallbackImage,
          manifest,
          onSnapshot: safelySetSnapshot,
        });
        engine.start();
      } catch {
        safelySetSnapshot({
          status: "error",
          tier: null,
          hasRenderableFrame: false,
          renderer: null,
        });
      }
    };

    const handlePolicyChange = () => {
      const nextStaticPolicy = shouldStayStatic();
      if (nextStaticPolicy === previousStaticPolicy) return;
      previousStaticPolicy = nextStaticPolicy;
      boot();
    };

    reducedMotion.addEventListener?.("change", handlePolicyChange);
    connection?.addEventListener?.("change", handlePolicyChange);
    boot();

    return () => {
      disposed = true;
      reducedMotion.removeEventListener?.("change", handlePolicyChange);
      connection?.removeEventListener?.("change", handlePolicyChange);
      engine?.destroy();
      engine = null;
    };
  }, [manifest]);

  return {
    ...snapshot,
    sectionRef,
    pinRef,
    videoRef,
    canvasRef,
    fallbackImageRef,
  };
}
