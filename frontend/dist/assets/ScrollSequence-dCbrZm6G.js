const r={frameCount:216,frameStart:1,framePad:4,framePath:"/images/sequence/frame_{frame}.jpg",frameFit:"contain"};function t(s={}){const a={...r,...s},e=document.createElement("section");return e.className="scroll-sequence",e.dataset.scrollSequence="generator",e.dataset.frameCount=String(a.frameCount),e.dataset.frameStart=String(a.frameStart),e.dataset.framePad=String(a.framePad),e.dataset.framePath=a.framePath,e.dataset.frameFit=a.frameFit,e.innerHTML=`
    <div class="scroll-sequence__pin">
      <canvas
        class="scroll-sequence__canvas"
        data-sequence-canvas
        width="1920"
        height="1080"
        role="img"
        aria-label="Animated industrial diesel generator sequence"
      >
        Animated industrial diesel generator sequence.
      </canvas>

      <div class="scroll-sequence__loader" data-sequence-loader role="status" aria-live="polite">
        <span class="scroll-sequence__loader-copy">Loading frames</span>
        <span class="scroll-sequence__loader-percent" data-sequence-progress>0%</span>
        <span class="scroll-sequence__loader-track" aria-hidden="true">
          <span class="scroll-sequence__loader-bar" data-sequence-bar></span>
        </span>
      </div>
    </div>
  `,e}export{r as SCROLL_SEQUENCE_CONFIG,t as createScrollSequenceSection};
