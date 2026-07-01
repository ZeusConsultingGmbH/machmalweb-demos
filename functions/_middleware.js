export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const host = url.hostname;

  // Nur auf *.machmalweb.de Subdomains reagieren
  const isDemoHost = host.endsWith(".machmalweb.de");
  const parts = host.split(".");
  const reserved = ["www"];
  const isDemoSubdomain =
    isDemoHost && parts.length >= 3 && !reserved.includes(parts[0]);

  if (isDemoSubdomain) {
    // Jede Demo aus Google raushalten
    if (url.pathname === "/robots.txt") {
      return new Response("User-agent: *\nDisallow: /\n", {
        headers: { "content-type": "text/plain" },
      });
    }

    const slug = parts[0];
    const assetUrl = new URL(request.url);
    assetUrl.pathname = `/${slug}/index.html`;
    const res = await env.ASSETS.fetch(new Request(assetUrl, request));

    // Unbekannter Demo-Name → Besucher auf die Hauptseite schicken
    if (res.status === 404) {
      return Response.redirect("https://machmalweb.de", 302);
    }
    return res;
  }

  return next();
}
