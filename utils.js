import { safeText } from "./utils.js";

const DEFAULT_KEY = "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";
const LS_KEY = "omaystro_openrouter_key_v1";

export const getKey = () => {
  const stored = safeText(localStorage.getItem(LS_KEY) || "");
  return stored || DEFAULT_KEY;
};

export const setKey = (key) => {
  const k = safeText(key);
  if (k) localStorage.setItem(LS_KEY, k);
};

export const clearKey = () => {
  localStorage.removeItem(LS_KEY);
};

export const chat = async ({ messages, model = "deepseek/deepseek-chat-v3-0324:free" }) => {
  const target = "https://openrouter.ai/api/v1/chat/completions";
  const proxy = "https://dev-edge.flowith.net/api-proxy/" + encodeURIComponent(target);

  const key = getKey();
  const res = await fetch(proxy, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "O’Maystro Website"
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7
    })
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`OpenRouter error (${res.status}): ${txt || res.statusText}`);
  }

  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  return safeText(content || "");
};
