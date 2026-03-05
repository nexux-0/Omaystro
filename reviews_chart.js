import { qs, qsa, safeText, formatDh, formatPizzaPrice, setHidden, debounce } from "./utils.js";

const buildPriceHtml = (item, currency) => {
  if (item.price && typeof item.price === "object") {
    const s = formatPizzaPrice(item.price);
    return `<span class="menu_price"><b>${safeText(s)}</b></span>`;
  }
  if (item.price === null || item.price === undefined) {
    return `<span class="menu_price"><span class="text-white/40">—</span></span>`;
  }
  return `<span class="menu_price"><b>${safeText(formatDh(item.price))}</b></span>`;
};

const normalize = (s) => {
  const str = safeText(s).toLowerCase();
  const rx = new RegExp("\\s+", "g");
  return str.replace(rx, " ").trim();
};

const matchesQuery = (name, query) => {
  const n = normalize(name);
  const q = normalize(query);
  if (!q) return true;
  return n.includes(q);
};

export const initMenu = ({ menu }) => {
  const tabsEl = qs("#menu_tabs");
  const panelEl = qs("#menu_panel");
  const emptyEl = qs("#menu_empty");
  const searchEl = qs("#menu_search");
  const clearEl = qs("#menu_clear");

  if (!menu || !tabsEl || !panelEl) return;

  let active = menu.categories?.[0]?.id || "";
  let query = "";

  const renderTabs = () => {
    tabsEl.innerHTML = (menu.categories || [])
      .map(
        (c) =>
          `<button class="tab" data-tab="${safeText(c.id)}" data-active="${c.id === active ? "true" : "false"}" type="button">${safeText(c.label)}</button>`
      )
      .join("");
  };

  const renderItems = () => {
    const cat = (menu.categories || []).find((c) => c.id === active);
    const items = (cat?.items || []).filter((it) => matchesQuery(it.name, query));
    const note = cat?.note ? `<div class="glass_panel p-4 text-sm text-white/65 mb-3">${safeText(cat.note)}</div>` : "";

    panelEl.innerHTML =
      note +
      items
        .map((it) => {
          const meta = it.meta ? `<div class="menu_meta">${safeText(it.meta)}</div>` : "";
          return `<div class="menu_card reveal_item">
              <div>
                <div class="menu_name">${safeText(it.name)}</div>
                ${meta}
              </div>
              ${buildPriceHtml(it, menu.currency)}
            </div>`;
        })
        .join("");

    setHidden(emptyEl, items.length > 0);
  };

  const setActive = (id) => {
    active = id;
    qsa(".tab", tabsEl).forEach((b) => b.setAttribute("data-active", b.getAttribute("data-tab") === active ? "true" : "false"));
    renderItems();
    window.dispatchEvent(new CustomEvent("omaystro:menu_rendered"));
  };

  tabsEl.addEventListener("click", (e) => {
    const btn = e.target?.closest?.(".tab");
    const id = btn?.getAttribute?.("data-tab");
    if (!id) return;
    setActive(id);
  });

  const applySearch = debounce(() => {
    query = safeText(searchEl?.value || "");
    setHidden(clearEl, !query);
    renderItems();
    window.dispatchEvent(new CustomEvent("omaystro:menu_rendered"));
  }, 80);

  searchEl?.addEventListener("input", applySearch);
  clearEl?.addEventListener("click", () => {
    if (searchEl) searchEl.value = "";
    query = "";
    setHidden(clearEl, true);
    renderItems();
    window.dispatchEvent(new CustomEvent("omaystro:menu_rendered"));
  });

  renderTabs();
  renderItems();
  window.dispatchEvent(new CustomEvent("omaystro:menu_rendered"));
};
