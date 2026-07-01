export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Alle Demos aus Google raushalten
    if (url.pathname === "/robots.txt") {
      return new Response("User-agent: *\nDisallow: /\n", {
        headers: { "content-type": "text/plain" },
      });
    }

    // Ersten Pfad-Abschnitt als Demo-Namen nehmen: /maler-mueller
    const segments = url.pathname.split("/").filter(Boolean);
    const slug = segments[0];

    // Nackte Domain ohne Namen -> auf die Hauptseite
    if (!slug) {
      return Response.redirect("https://machmalweb.de", 302);
    }

    // Passende Demo aus dem public-Ordner holen
    const assetUrl = new URL(request.url);
    assetUrl.pathname = `/${slug}/index.html`;
    const res = await env.ASSETS.fetch(new Request(assetUrl, request));

    // Unbekannte Demo -> auf die Hauptseite
    if (res.status === 404) {
      return Response.redirect("https://machmalweb.de", 302);
    }
    return res;
  },
};
