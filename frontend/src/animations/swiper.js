import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Swiper from "swiper";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";

export function initSwipers(selector = ".js-swiper", options = {}) {
  return Array.from(document.querySelectorAll(selector)).map((element) => {
    const baseOptions = {
      modules: [A11y, Autoplay, Keyboard, Navigation, Pagination],
      grabCursor: true,
      watchOverflow: true,
      roundLengths: true,
      resizeObserver: true,
      lazyPreloadPrevNext: 1,
      slidesPerView: 1,
      spaceBetween: 24,
      speed: 650,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      a11y: {
        enabled: true,
        firstSlideMessage: "This is the first slide",
        lastSlideMessage: "This is the last slide",
        nextSlideMessage: "Next slide",
        prevSlideMessage: "Previous slide",
      },
      pagination: {
        el: element.querySelector(".swiper-pagination"),
        clickable: true,
      },
      navigation: {
        nextEl: element.querySelector(".swiper-button-next"),
        prevEl: element.querySelector(".swiper-button-prev"),
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    };


    return new Swiper(element, {
      ...baseOptions,
      ...options,
      keyboard: {
        ...baseOptions.keyboard,
        ...options.keyboard,
      },
      a11y: {
        ...baseOptions.a11y,
        ...options.a11y,
      },
      pagination: {
        ...baseOptions.pagination,
        ...options.pagination,
      },
      navigation: {
        ...baseOptions.navigation,
        ...options.navigation,
      },
    });
  });
}
