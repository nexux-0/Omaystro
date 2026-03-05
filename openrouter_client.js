import { qs, safeText, setHidden } from "./utils.js";

const LS_KEY = "omaystro_gallery_urls_v1";

const readUrls = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeUrls = (urls) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(urls.slice(0, 60)));
  } catch {}
};

const fileToDataUrl = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });

const renderGrid = (gridEl, hintEl, entries) => {
  if (!gridEl) return;
  gridEl.innerHTML = entries
    .map((e, idx) => {
      const label = e.label ? safeText(e.label) : `Photo ${idx + 1}`;
      const src = safeText(e.src);
      return `<div class="photo_card reveal_item">
        <img src="${src}" alt="${label}" loading="lazy" />
        <div class="photo_bar">
          <div class="photo_label">${label}</div>
          <button class="btn btn_ghost px-3 py-0 h-8" data-remove="${idx}" type="button" aria-label="Remove">
            <i data-lucide="trash-2" class="h-4 w-4"></i>
          </button>
        </div>
      </div>`;
    })
    .join("");

  setHidden(hintEl, entries.length > 0);
  window.dispatchEvent(new CustomEvent("omaystro:gallery_rendered"));
};

export const initGallery = ({ openUrlModal }) => {
  const gridEl = qs("#gallery_grid");
  const hintEl = qs("#gallery_hint");
  const filesEl = qs("#gallery_files");
  const addUrlBtn = qs("#gallery_add_url");
  const clearBtn = qs("#gallery_clear");

  let entries = readUrls().map((u) => ({ src: u, label: "Social photo" }));

  const addUrls = (urls) => {
    const cleaned = urls.map((u) => safeText(u)).filter((u) => u.startsWith("http"));
    cleaned.forEach((u) => entries.unshift({ src: u, label: "Social photo" }));
    entries = entries.slice(0, 60);
    writeUrls(entries.filter((x) => x.src.startsWith("http")).map((x) => x.src));
    renderGrid(gridEl, hintEl, entries);
  };

  const addFiles = async (files) => {
    const list = Array.from(files || []).slice(0, 24);
    const converted = await Promise.all(
      list.map(async (f) => {
        const src = await fileToDataUrl(f);
        return src ? { src, label: f.name } : null;
      })
    );
    converted.filter(Boolean).forEach((e) => entries.unshift(e));
    entries = entries.slice(0, 60);
    renderGrid(gridEl, hintEl, entries);
  };

  filesEl?.addEventListener("change", async () => {
    await addFiles(filesEl.files);
    filesEl.value = "";
  });

  addUrlBtn?.addEventListener("click", () => openUrlModal?.({ onSave: (u) => addUrls([u]) }));

  clearBtn?.addEventListener("click", () => {
    entries = [];
    writeUrls([]);
    renderGrid(gridEl, hintEl, entries);
  });

  gridEl?.addEventListener("click", (e) => {
    const btn = e.target?.closest?.("[data-remove]");
    const idxStr = btn?.getAttribute?.("data-remove");
    if (idxStr === null || idxStr === undefined) return;
    const idx = Number(idxStr);
    if (!Number.isFinite(idx)) return;
    entries.splice(idx, 1);
    writeUrls(entries.filter((x) => x.src.startsWith("http")).map((x) => x.src));
    renderGrid(gridEl, hintEl, entries);
  });

  renderGrid(gridEl, hintEl, entries);

  return {
    addUrl: (u) => addUrls([u])
  };
};
