import { qsa } from "./utils.js";

export const initAnimations = () => {
  if (!window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  const animateBatch = () => {
    const items = qsa(".reveal_item").filter((el) => !el.getAttribute("data-revealed"));
    if (items.length === 0) return;

    items.forEach((el) => el.setAttribute("data-revealed", "true"));

    window.gsap.fromTo(
      items,
      { y: 12, opacity: 0, filter: "blur(4px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: {
          trigger: items[0].parentElement,
          start: "top 85%"
        }
      }
    );
  };

  animateBatch();

  window.addEventListener("omaystro:menu_rendered", () => {
    window.setTimeout(animateBatch, 30);
  });

  window.addEventListener("omaystro:gallery_rendered", () => {
    window.setTimeout(animateBatch, 30);
  });
};
