// Proxies chat to NVIDIA's Nemotron 3 Ultra using the visitor's own key.
const MODEL = "nvidia/nemotron-3-ultra-550b-a55b";

export default async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  // Each person uses their own free NVIDIA key, sent from their device. Nothing is stored here.
  const key = (req.headers.get("x-nvidia-key") || "").trim();
  if (!key) return new Response("No NVIDIA key yet. Tap the gear and paste your key.", { status: 401 });

  let body;
  try { body = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-40) : [];
  if (!messages.length) return new Response("No messages", { status: 400 });

  const upstream = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({
      model: MODEL, messages, stream: true, temperature: 0.7, top_p: 0.95, max_tokens: 8192,
      chat_template_kwargs: { enable_thinking: !!body.thinking },
    }),
  });
  if (upstream.status === 401 || upstream.status === 403)
    return new Response("NVIDIA says that key is wrong. Tap the gear and paste it again.", { status: 401 });
  if (!upstream.ok) return new Response(`NVIDIA error ${upstream.status}: ${await upstream.text()}`, { status: 502 });
  return new Response(upstream.body, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } });
};
