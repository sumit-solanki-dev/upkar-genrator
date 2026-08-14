import { useEffect, useRef, useState } from "react";

import type {
  SequenceEngine,
  SequenceManifest,
  SequenceSnapshot,
} from "./sequence-types";

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
};

export function useScrollSequence(manifest: SequenceManifest) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackImageRef = useRef<HTMLImageElement>(null);
  const [snapshot, setSnapshot] = useState<SequenceSnapshot>(INITIAL_SNAPSHOT);

  useEffect(() => {
    let disposed = false;
    let bootGeneration = 0;
    let engine: SequenceEngine | null = null;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as NavigatorWithConnection).connection;
    const shouldStayStatic = () => reducedMotion.matches || connection?.saveData === true;
    let previousStaticPolicy = shouldStayStatic();

    const safelySetSnapshot = (nextSnapshot: SequenceSnapshot) => {
      if (!disposed) setSnapshot(nextSnapshot);
    };

    const boot = async () => {
      const currentGeneration = ++bootGeneration;
      engine?.destroy();
      engine = null;

      if (shouldStayStatic()) {
        safelySetSnapshot({ status: "static", tier: null, hasRenderableFrame: false });
        return;
      }

      const section = sectionRef.current;
      const pin = pinRef.current;
      const canvas = canvasRef.current;
      const fallbackImage = fallbackImageRef.current;

      if (!section || !pin || !canvas || !fallbackImage) {
        safelySetSnapshot({ status: "static", tier: null, hasRenderableFrame: false });
        return;
      }

      safelySetSnapshot({ status: "loading", tier: null, hasRenderableFrame: false });

      try {
        const { createSequenceEngine } = await import("./sequence-engine.client");
        if (disposed || currentGeneration !== bootGeneration) return;

        engine = createSequenceEngine({
          section,
          pin,
          canvas,
          fallbackImage,
          manifest,
          onSnapshot: safelySetSnapshot,
        });
        engine.start();
      } catch {
        safelySetSnapshot({ status: "error", tier: null, hasRenderableFrame: false });
      }
    };

    const handlePolicyChange = () => {
      const nextStaticPolicy = shouldStayStatic();
      if (nextStaticPolicy === previousStaticPolicy) return;
      previousStaticPolicy = nextStaticPolicy;
      void boot();
    };

    reducedMotion.addEventListener?.("change", handlePolicyChange);
    connection?.addEventListener?.("change", handlePolicyChange);
    void boot();

    return () => {
      disposed = true;
      bootGeneration += 1;
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
    canvasRef,
    fallbackImageRef,
  };
}
