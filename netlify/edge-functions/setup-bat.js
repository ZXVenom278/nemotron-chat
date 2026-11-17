// Serves the PC setup file pointed at whichever copy of the site it was downloaded from.
export default async (req, context) => {
  const res = await context.next();
  const text = (await res.text()).replaceAll("https://nemotron-ultra-chat.netlify.app", new URL(req.url).origin);
  const headers = new Headers(res.headers); headers.delete("content-length");
  return new Response(text, { headers });
};
