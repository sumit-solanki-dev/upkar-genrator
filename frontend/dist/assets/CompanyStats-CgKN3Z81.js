const s=[{value:13,suffix:"+",label:"Years Experience"},{value:1e3,suffix:"+",label:"Generators Delivered"},{value:800,suffix:"+",label:"Happy Clients"},{value:24,suffix:"/7",label:"Customer Support"}];function t(){const e=document.createElement("section");return e.className="company-stats",e.dataset.companyStats="section",e.setAttribute("aria-label","Company statistics"),e.innerHTML=`
    <div class="container company-stats__inner">
      <div class="company-stats__grid">
        ${s.map(a=>`
            <article class="company-stat-card" data-stat-card>
              <p
                class="company-stat-card__value"
                aria-label="${a.value}${a.suffix} ${a.label}"
              >
                <span data-stat-number data-stat-value="${a.value}" data-stat-suffix="${a.suffix}">0${a.suffix}</span>
              </p>
              <h2 class="company-stat-card__label">${a.label}</h2>
            </article>
          `).join("")}
      </div>
    </div>
  `,e}export{t as createCompanyStatsSection};
