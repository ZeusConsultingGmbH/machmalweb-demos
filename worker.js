export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname;

    // Demo-Subdomains: <slug>.demo.machmalweb.de
    if (host.endsWith(".demo.machmalweb.de")) {
      const slug = host.split(".")[0];

      // Demos aus Google raushalten
      if (url.pathname === "/robots.txt") {
        return new Response("User-agent: *\nDisallow: /\n", {
          headers: { "content-type": "text/plain" },
        });
      }

      // Passende Demo aus dem public-Ordner holen
      const assetUrl = new URL(request.url);
      assetUrl.pathname = `/${slug}/index.html`;
      const res = await env.ASSETS.fetch(new Request(assetUrl, request));

      // Unbekannte Demo -> zurück auf die Hauptseite
      if (res.status === 404) {
        return Response.redirect("https://machmalweb.de", 302);
      }
      return res;
    }

    // Alles andere (z.B. Test über die workers.dev-Adresse)
    return env.ASSETS.fetch(request);
  },
};
