const t={frameCount:216,frameStart:1,framePad:4,framePath:"/images/sequence/frame_{frame}.webp",frameFit:"contain"};function n(s={}){const a={...t,...s},e=document.createElement("section");return e.className="scroll-sequence",e.dataset.scrollSequence="generator",e.dataset.frameCount=String(a.frameCount),e.dataset.frameStart=String(a.frameStart),e.dataset.framePad=String(a.framePad),e.dataset.framePath=a.framePath,e.dataset.frameFit=a.frameFit,e.innerHTML=`
    <div class="scroll-sequence__pin">
      <img
        class="scroll-sequence__image"
        data-sequence-image
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; display: block;"
        alt="Animated industrial diesel generator sequence"
      />
      <canvas
        class="scroll-sequence__canvas"
        data-sequence-canvas
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: none;"
        aria-hidden="true"
      ></canvas>

      <div class="scroll-sequence__loader" data-sequence-loader role="status" aria-live="polite">
        <span class="scroll-sequence__loader-copy">Loading frames</span>
        <span class="scroll-sequence__loader-percent" data-sequence-progress>0%</span>
        <span class="scroll-sequence__loader-track" aria-hidden="true">
          <span class="scroll-sequence__loader-bar" data-sequence-bar></span>
        </span>
      </div>
    </div>
  `,e}export{t as SCROLL_SEQUENCE_CONFIG,n as createScrollSequenceSection};
