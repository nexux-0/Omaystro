import { qs, qsa, setHidden } from "./utils.js";

export const initNav = () => {
  const mobileBtn = qs("#open_mobile");
  const mobilePanel = qs("#mobile_panel");
  const links = qsa('a[href^="#"]:not([href="#"])');

  const toggleMobile = () => setHidden(mobilePanel, !mobilePanel.classList.contains("hidden"));
  mobileBtn?.addEventListener("click", toggleMobile);

  links.forEach((a) => {
    a.addEventListener("click", () => setHidden(mobilePanel, true));
  });

  const navLinks = qsa(".nav_link");
  const sections = navLinks
    .map((a) => {
      const id = a.getAttribute("href")?.slice(1);
      const el = id ? qs(`#${id}`) : null;
      return { a, el, id };
    })
    .filter((x) => x.el);

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (!visible) return;
      const id = visible.target.getAttribute("id");
      navLinks.forEach((a) => a.setAttribute("data-active", a.getAttribute("href") === `#${id}` ? "true" : "false"));
    },
    { root: null, rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.2, 0.35, 0.5] }
  );

  sections.forEach(({ el }) => io.observe(el));
};
