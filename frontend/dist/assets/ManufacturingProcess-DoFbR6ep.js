const t=[{title:"Design",description:"Power requirements, layout, and enclosure details are mapped before production starts."},{title:"Fabrication",description:"Frames and structural parts are cut, formed, welded, and prepared for assembly."},{title:"Assembly",description:"Engine, alternator, controls, wiring, and acoustic systems are integrated."},{title:"Testing",description:"Load, safety, and performance checks validate output under operating conditions."},{title:"Quality Inspection",description:"Final inspection confirms finish, fit, documentation, and compliance details."},{title:"Delivery",description:"The generator is prepared, dispatched, and handed over for installation."}];function i(){const e=document.createElement("section");return e.className="manufacturing-process",e.dataset.manufacturingProcess="section",e.innerHTML=`
    <div class="container manufacturing-process__inner">
      <div class="manufacturing-process__heading" data-process-heading>
        <p class="manufacturing-process__eyebrow">Manufacturing Process</p>
        <h2 class="manufacturing-process__title">From design desk to dependable power</h2>
      </div>

      <div class="manufacturing-process__timeline" aria-label="Manufacturing process timeline">
        <span class="manufacturing-process__track" aria-hidden="true">
          <span class="manufacturing-process__track-fill" data-process-line></span>
        </span>

        ${t.map((s,a)=>`
            <article class="process-step" data-process-step>
              <span class="process-step__marker" aria-hidden="true">${String(a+1).padStart(2,"0")}</span>
              <div class="process-step__body">
                <h3 class="process-step__title">${s.title}</h3>
                <p class="process-step__description">${s.description}</p>
              </div>
            </article>
          `).join("")}
      </div>
    </div>
  `,e}export{i as createManufacturingProcessSection};
