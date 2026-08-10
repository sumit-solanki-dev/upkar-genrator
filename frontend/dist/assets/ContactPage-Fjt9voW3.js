import{s as o,C as t}from"./index-FSIX69Dx.js";const n=[{day:"Monday - Saturday",time:"9:00 AM - 7:00 PM"},{day:"Sunday",time:"Emergency support only"}];function c(a){const s=a.replace(/\D/g,""),e=encodeURIComponent("Hello UPKAR Generator, I would like to request a quote.");return`https://wa.me/${s}?text=${e}`}function l(){o({title:"Contact",description:"Contact UPKAR Generator for diesel generator quotes, service support, business hours, phone, email, and location details.",path:"/contact/"});const a=document.createElement("div"),s=c(t.phone);return a.className="contact-page",a.innerHTML=`
    <section class="contact-hero" aria-labelledby="contact-title">
      <div class="container contact-hero__inner">
        <p class="contact-hero__eyebrow">Contact</p>
        <h1 class="contact-hero__title" id="contact-title">Talk to UPKAR Generator</h1>
        <p class="contact-hero__description">
          Reach our team for product quotes, service questions, and dependable diesel power guidance.
        </p>
      </div>
    </section>

    <section class="contact-section" aria-label="Company details and location">
      <div class="container contact-section__inner">
        <aside class="contact-details" aria-label="Company details">
          <div class="contact-details__card">
            <h2 class="contact-details__title">Company Details</h2>
            <ul class="contact-details__list">
              <li>
                <span class="contact-details__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.5 1.7L7.8 9.5a16 16 0 0 0 6.7 6.7l1.3-1.3a2 2 0 0 1 1.7-.5l2.8.5a2 2 0 0 1 1.7 2Z" /></svg>
                </span>
                <a href="tel:${t.phone}">${t.phone}</a>
              </li>
              <li>
                <span class="contact-details__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>
                </span>
                <a href="mailto:${t.email}">${t.email}</a>
              </li>
              <li>
                <span class="contact-details__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 21s7-5.4 7-12a7 7 0 0 0-14 0c0 6.6 7 12 7 12Z" /><circle cx="12" cy="9" r="2.4" /></svg>
                </span>
                <span>${t.location}</span>
              </li>
            </ul>

            <div class="contact-details__actions">
              <a class="contact-details__button contact-details__button--call" href="tel:${t.phone}">Call Now</a>
              <a class="contact-details__button contact-details__button--whatsapp" href="${s}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a class="contact-details__button contact-details__button--email" href="mailto:${t.email}">Email</a>
            </div>
          </div>

          <div class="contact-hours">
            <h2 class="contact-details__title">Business Hours</h2>
            <dl class="contact-hours__list">
              ${n.map(e=>`
                  <div>
                    <dt>${e.day}</dt>
                    <dd>${e.time}</dd>
                  </div>
                `).join("")}
            </dl>
          </div>
        </aside>

        <div class="contact-map" aria-label="UPKAR Generator location on Google Maps">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3694.0073071475617!2d75.4694067!3d22.2018286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39626f9747c05419%3A0x5e733839d4504032!2sUpkar%20generator!5e0!3m2!1sen!2sin!4v1785756048465!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            title="UPKAR Generator location"
          ></iframe>
          <div class="contact-map__actions">
            <a class="contact-details__button contact-details__button--directions" href="https://maps.google.com/maps?q=Upkar+generator" target="_blank" rel="noopener noreferrer">Get Directions</a>
          </div>
        </div>
      </div>
    </section>
  `,a}export{l as createContactPage};
