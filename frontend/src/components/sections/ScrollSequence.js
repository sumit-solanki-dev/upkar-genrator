export const SCROLL_SEQUENCE_CONFIG = {
  frameCount: 216,
  frameStart: 1,
  framePad: 4,
  framePath: "/images/sequence/frame_{frame}.jpg",
  frameFit: "contain",
};

export function createScrollSequenceSection(config = {}) {
  const settings = { ...SCROLL_SEQUENCE_CONFIG, ...config };
  const section = document.createElement("section");

  section.className = "scroll-sequence";
  section.dataset.scrollSequence = "generator";
  section.dataset.frameCount = String(settings.frameCount);
  section.dataset.frameStart = String(settings.frameStart);
  section.dataset.framePad = String(settings.framePad);
  section.dataset.framePath = settings.framePath;
  section.dataset.frameFit = settings.frameFit;
  section.innerHTML = `
    <div class="scroll-sequence__pin">
      <img
        class="scroll-sequence__image"
        data-sequence-image
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; display: block;"
        alt="Animated industrial diesel generator sequence"
      />

      <div class="scroll-sequence__loader" data-sequence-loader role="status" aria-live="polite">
        <span class="scroll-sequence__loader-copy">Loading frames</span>
        <span class="scroll-sequence__loader-percent" data-sequence-progress>0%</span>
        <span class="scroll-sequence__loader-track" aria-hidden="true">
          <span class="scroll-sequence__loader-bar" data-sequence-bar></span>
        </span>
      </div>
    </div>
  `;

  return section;
}
