import { qs, qsa, safeText, buildMapsUrl, buildMapsEmbedUrl, buildTelUrl, buildWhatsappUrl, setHidden } from "./utils.js";
import { initNav } from "./nav.js";
import { initMenu } from "./menu.js";
import { initGallery } from "./gallery.js";
import { initBooking } from "./booking.js";
import { initAnimations } from "./animations.js";
import { initReviewsChart } from "./reviews_chart.js";
import { initThreeParticles } from "./three_particles.js";
import { initAiConcierge } from "./ai_concierge.js";
import { setKey, clearKey, getKey } from "./openrouter_client.js";

const loadJson = async (path) => {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
};

const loadText = async (path) => {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.text();
};

const wireCtas = (site) => {
  const tel = buildTelUrl(site.phone_display);
  const maps = buildMapsUrl(site.maps_query);
  const mapsEmbed = buildMapsEmbedUrl(site.maps_query);
  const wa = buildWhatsappUrl(site.phone_e164, site.whatsapp_message_default);

  const callIds = [
    "#cta_call_top",
    "#cta_call_hero",
    "#cta_call_card",
    "#cta_call_about",
    "#cta_call_reviews",
    "#cta_call_location",
    "#cta_call_footer"
  ];

  callIds.forEach((id) => {
    const a = qs(id);
    if (a) a.setAttribute("href", tel);
  });

  const dirIds = ["#cta_directions_top", "#cta_directions_hero", "#cta_directions_card"];
  dirIds.forEach((id) => {
    const a = qs(id);
    if (a) a.setAttribute("href", maps);
  });

  const mapsIds = ["#cta_maps_location", "#cta_maps_footer"];
  mapsIds.forEach((id) => {
    const a = qs(id);
    if (a) a.setAttribute("href", maps);
  });

  const glovoIds = ["#cta_glovo_top", "#cta_glovo_hero", "#cta_glovo_card", "#cta_glovo_location", "#cta_glovo_footer"];
  glovoIds.forEach((id) => {
    const a = qs(id);
    if (a) a.setAttribute("href", safeText(site.glovo_url || "#"));
  });

  const mapIframe = qs("#map_iframe");
  if (mapIframe) mapIframe.setAttribute("src", mapsEmbed);

  const waFloat = qs("#whatsapp_float");
  if (waFloat) waFloat.setAttribute("href", wa);

  const address1 = qs("#address_line");
  const address2 = qs("#address_line_2");
  const address3 = qs("#address_line_3");
  [address1, address2, address3].forEach((el) => {
    if (el) el.textContent = safeText(site.address);
  });

  const plus = qs("#plus_code");
  const plus2 = qs("#plus_code_2");
  [plus, plus2].forEach((el) => {
    if (el) el.textContent = safeText(site.plus_code);
  });

  const openHours = qs("#open_hours");
  if (openHours) openHours.textContent = safeText(site.opening_hours).replace("Opens at ", "");

  const hoursLine = qs("#hours_line");
  if (hoursLine) hoursLine.textContent = safeText(site.opening_hours);

  const phoneLink = qs("#phone_link");
  if (phoneLink) {
    phoneLink.textContent = safeText(site.phone_display);
    phoneLink.setAttribute("href", tel);
  }
};

const renderReviews = (reviews) => {
  const wrap = qs("#review_cards");
  if (!wrap) return;
  const stars = (n) => {
    const count = Math.max(0, Math.min(5, Number(n) || 0));
    return "★".repeat(count) + "☆".repeat(5 - count);
  };

  wrap.innerHTML = (reviews.testimonials || [])
    .map((r) => {
      const initials = safeText(r.name).slice(0, 1).toUpperCase();
      return `<div class="glass_panel p-5 reveal_item">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-2xl bg-white/8 border border-white/10 grid place-items-center">
              <span class="font-display text-gold text-lg">${initials}</span>
            </div>
            <div>
              <div class="font-medium">${safeText(r.name)}</div>
              <div class="text-xs text-white/55 mt-0.5">${safeText(r.badge)}</div>
            </div>
          </div>
          <div class="text-gold text-xs tracking-wide">${safeText(stars(r.stars))}</div>
        </div>
        <div class="mt-3 text-sm text-white/70 leading-relaxed">${safeText(r.text)}</div>
      </div>`;
    })
    .join("");
};

const initModals = () => {
  const backdrop = qs("#modal_backdrop");

  const urlModal = qs("#url_modal");
  const closeUrl = qs("#close_url");
  const saveUrl = qs("#save_url");
  const urlInput = qs("#img_url");

  const keyModal = qs("#key_modal");
  const closeKey = qs("#close_key");
  const saveKey = qs("#save_key");
  const clearKeyBtn = qs("#clear_key");
  const keyInput = qs("#or_key");
  const keyOpen = qs("#ai_key");

  let urlOnSave = null;

  const openBackdrop = () => setHidden(backdrop, false);
  const closeBackdropIfNoModal = () => {
    const anyOpen = [qs("#booking_modal"), urlModal, keyModal].some((m) => m && !m.classList.contains("hidden"));
    if (!anyOpen) setHidden(backdrop, true);
  };

  const openUrlModal = ({ onSave } = {}) => {
    urlOnSave = typeof onSave === "function" ? onSave : null;
    openBackdrop();
    setHidden(urlModal, false);
    if (urlInput) urlInput.value = "";
    document.body.style.overflow = "hidden";
    window.setTimeout(() => urlInput?.focus?.(), 50);
  };

  const closeUrlModal = () => {
    setHidden(urlModal, true);
    document.body.style.overflow = "";
    closeBackdropIfNoModal();
  };

  closeUrl?.addEventListener("click", closeUrlModal);
  saveUrl?.addEventListener("click", () => {
    const v = safeText(urlInput?.value);
    if (v && urlOnSave) urlOnSave(v);
    closeUrlModal();
  });

  const openKeyModal = () => {
    openBackdrop();
    setHidden(keyModal, false);
    document.body.style.overflow = "hidden";
    if (keyInput) keyInput.value = getKey();
    window.setTimeout(() => keyInput?.focus?.(), 50);
  };

  const closeKeyModal = () => {
    setHidden(keyModal, true);
    document.body.style.overflow = "";
    closeBackdropIfNoModal();
  };

  keyOpen?.addEventListener("click", openKeyModal);
  closeKey?.addEventListener("click", closeKeyModal);

  saveKey?.addEventListener("click", () => {
    const v = safeText(keyInput?.value);
    if (v) setKey(v);
    closeKeyModal();
  });

  clearKeyBtn?.addEventListener("click", () => {
    clearKey();
    if (keyInput) keyInput.value = getKey();
  });

  backdrop?.addEventListener("click", () => {
    [urlModal, keyModal].forEach((m) => setHidden(m, true));
    document.body.style.overflow = "";
    closeBackdropIfNoModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    [urlModal, keyModal].forEach((m) => setHidden(m, true));
    document.body.style.overflow = "";
    closeBackdropIfNoModal();
  });

  return { openUrlModal, openKeyModal };
};

const initIcons = () => {
  if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
};

const reInitIconsSoon = () => window.setTimeout(initIcons, 40);

const main = async () => {
  const [site, menu, reviews, aboutMd] = await Promise.all([
    loadJson("data/site.json"),
    loadJson("data/menu.json"),
    loadJson("data/reviews.json"),
    loadText("content/about.md")
  ]);

  wireCtas(site);

  const aboutEl = qs("#about_md");
  if (aboutEl && window.marked) {
    aboutEl.innerHTML = window.marked.parse(aboutMd);
  }

  renderReviews(reviews);

  const { openUrlModal } = initModals();

  initNav();
  initMenu({ menu });
  initGallery({ openUrlModal });
  initBooking({ site });
  initAnimations();
  initReviewsChart({ reviews });
  initThreeParticles();
  initAiConcierge({ menu });

  const year = qs("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  initIcons();
  window.addEventListener("omaystro:menu_rendered", reInitIconsSoon);
  window.addEventListener("omaystro:gallery_rendered", reInitIconsSoon);

  const bookingHero = qs("#open_booking_hero");
  bookingHero?.addEventListener("click", () => {});
};

main().catch((e) => {
  const msg = safeText(e?.message || "Failed to start app.");
  const el = document.createElement("div");
  el.className = "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] glass_panel p-4 z-[100]";
  el.textContent = msg;
  document.body.appendChild(el);
  window.setTimeout(() => el.remove(), 7000);
});
