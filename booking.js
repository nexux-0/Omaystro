import { qs, safeText, setHidden } from "./utils.js";
import { chat } from "./openrouter_client.js";

const menuToLines = (menu) => {
  const lines = [];
  (menu?.categories || []).forEach((c) => {
    lines.push(`${c.label}:`);
    (c.items || []).forEach((it) => {
      if (it.price && typeof it.price === "object") lines.push(`- ${it.name}: ${it.price.m}dh (M) / ${it.price.l}dh (L)`);
      else if (it.price === null || it.price === undefined) lines.push(`- ${it.name}: (price not specified)`);
      else lines.push(`- ${it.name}: ${it.price}dh`);
    });
    lines.push("");
  });
  return lines.join("\n").trim();
};

export const initAiConcierge = ({ menu }) => {
  const input = qs("#ai_input");
  const send = qs("#ai_send");
  const out = qs("#ai_output");
  const status = qs("#ai_status");

  const setStatus = (s) => {
    if (status) status.textContent = safeText(s);
  };

  const run = async () => {
    const q = safeText(input?.value);
    if (!q) return;

    setHidden(out, true);
    setStatus("Thinking…");

    const system = [
      "You are the AI concierge for a restaurant website called O’Maystro in Meknès, Morocco.",
      "Use ONLY the menu provided. Do not invent items or prices.",
      "Be concise, premium, and helpful. Recommend 2–4 options max, with prices.",
      "If the user asks about sandwiches and prices are not specified, say so and suggest checking the in-restaurant menu photo.",
      "",
      "MENU:",
      menuToLines(menu)
    ].join("\n");

    try {
      const text = await chat({
        messages: [
          { role: "system", content: system },
          { role: "user", content: q }
        ]
      });

      out.textContent = text || "No response.";
      setHidden(out, false);
      setStatus("");
    } catch (e) {
      out.textContent = safeText(e?.message || "Something went wrong.");
      setHidden(out, false);
      setStatus("Error");
    }
  };

  send?.addEventListener("click", run);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) run();
  });

  return { run };
};
