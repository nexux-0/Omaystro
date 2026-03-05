import { qs, safeText, setHidden, buildWhatsappUrl } from "./utils.js";

const todayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const nowTime = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const initBooking = ({ site }) => {
  const backdrop = qs("#modal_backdrop");
  const modal = qs("#booking_modal");

  const openBtns = [
    qs("#open_booking"),
    qs("#open_booking_hero"),
    qs("#open_booking_about"),
    qs("#open_booking_reviews"),
    qs("#open_booking_location")
  ].filter(Boolean);

  const closeBtn = qs("#close_booking");
  const sendBtn = qs("#booking_send");

  const nameEl = qs("#bk_name");
  const phoneEl = qs("#bk_phone");
  const dateEl = qs("#bk_date");
  const timeEl = qs("#bk_time");
  const guestsEl = qs("#bk_guests");
  const noteEl = qs("#bk_note");

  const open = () => {
    setHidden(backdrop, false);
    setHidden(modal, false);
    document.body.style.overflow = "hidden";
    if (dateEl && !dateEl.value) dateEl.value = todayISO();
    if (timeEl && !timeEl.value) timeEl.value = nowTime();
    window.setTimeout(() => nameEl?.focus?.(), 50);
  };

  const close = () => {
    setHidden(modal, true);
    setHidden(backdrop, true);
    document.body.style.overflow = "";
  };

  openBtns.forEach((b) => b.addEventListener("click", open));
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  sendBtn?.addEventListener("click", () => {
    const name = safeText(nameEl?.value);
    const phone = safeText(phoneEl?.value);
    const date = safeText(dateEl?.value);
    const time = safeText(timeEl?.value);
    const guests = safeText(guestsEl?.value);
    const note = safeText(noteEl?.value);

    const parts = [
      "Bonjour O’Maystro, je souhaite réserver une table.",
      name ? `Nom: ${name}` : "",
      phone ? `Téléphone: ${phone}` : "",
      date ? `Date: ${date}` : "",
      time ? `Heure: ${time}` : "",
      guests ? `Personnes: ${guests}` : "",
      note ? `Note: ${note}` : ""
    ].filter(Boolean);

    const msg = parts.join("\n");
    const url = buildWhatsappUrl(site.phone_e164, msg);
    window.open(url, "_blank", "noreferrer");
    close();
  });

  return { open, close };
};
