import { useId } from "react";

import "./scroll-sequence.css";

import { generatorSequenceManifest } from "./sequence-manifest";
import type { SequenceManifest } from "./sequence-types";
import { useScrollSequence } from "./use-scroll-sequence";

export interface ScrollSequenceProps {
  manifest?: SequenceManifest;
  className?: string;
  title?: string;
}

export function ScrollSequence({
  manifest = generatorSequenceManifest,
  className = "",
  title = "Explore the UPKAR generator",
}: ScrollSequenceProps) {
  const titleId = useId();
  const {
    status,
    tier,
    renderer,
    hasRenderableFrame,
    sectionRef,
    pinRef,
    videoRef,
    canvasRef,
    fallbackImageRef,
  } = useScrollSequence(manifest);
  const enhanced = status !== "idle" && status !== "static";
  const isLoading = status === "loading";

  return (
    <section
      ref={sectionRef}
      aria-busy={isLoading || undefined}
      aria-labelledby={titleId}
      className={`ug-scroll-sequence relative isolate bg-[#050505] text-white ${className}`.trim()}
      data-sequence-enhanced={enhanced ? "true" : "false"}
      data-sequence-status={status}
      data-sequence-tier={tier ?? "poster"}
      data-sequence-renderer={renderer ?? "poster"}
      data-sequence-renderable={hasRenderableFrame ? "true" : "false"}
    >
      <h2 id={titleId} className="sr-only">
        {title}
      </h2>

      <div
        ref={pinRef}
        className="ug-scroll-sequence__pin grid place-items-center bg-[#050505]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_72%,rgba(255,122,0,0.08),transparent_34%)]"
        />

        <img
          className={`ug-scroll-sequence__media z-10 object-contain transition-opacity motion-reduce:transition-none ${
            hasRenderableFrame ? "opacity-0" : "opacity-100"
          }`}
          src={manifest.poster.src}
          width={manifest.poster.width}
          height={manifest.poster.height}
          alt={manifest.poster.alt}
          decoding="async"
          loading="lazy"
        />

        <video
          ref={videoRef}
          className={`ug-scroll-sequence__media pointer-events-none z-20 object-contain transition-opacity motion-reduce:transition-none ${
            hasRenderableFrame && renderer === "video" ? "opacity-100" : "opacity-0"
          }`}
          width={manifest.video?.width ?? manifest.poster.width}
          height={manifest.video?.height ?? manifest.poster.height}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-hidden="true"
          hidden={renderer !== "video"}
        />

        <img
          ref={fallbackImageRef}
          className={`ug-scroll-sequence__media z-20 object-contain transition-opacity motion-reduce:transition-none ${
            hasRenderableFrame && renderer === "frames" ? "opacity-100" : "opacity-0"
          }`}
          alt=""
          aria-hidden="true"
          decoding="async"
          hidden
        />

        <canvas
          ref={canvasRef}
          className={`ug-scroll-sequence__media z-20 transition-opacity motion-reduce:transition-none ${
            hasRenderableFrame && renderer === "frames" ? "opacity-100" : "opacity-0"
          }`}
          width={manifest.poster.width}
          height={manifest.poster.height}
          aria-hidden="true"
        />

        <div
          className={`pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/15 bg-slate-950/75 px-4 py-2 text-sm font-semibold shadow-xl backdrop-blur-sm transition-opacity ${
            isLoading && !hasRenderableFrame ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!isLoading || hasRenderableFrame}
        >
          Loading generator animation
        </div>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {isLoading
            ? "Loading generator animation"
            : status === "error"
              ? "Generator animation unavailable. A static generator image is shown."
              : ""}
        </p>
      </div>
    </section>
  );
}
