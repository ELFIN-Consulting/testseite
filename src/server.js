// Minimaler Webserver ohne Abhängigkeiten: liefert public/ aus und /health für den Deploy-Check.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC_DIR = fileURLToPath(new URL("./public/", import.meta.url));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "content-type": type, "cache-control": "no-cache" });
  res.end(body);
}

export function createApp() {
  return createServer(async (req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
    } catch {
      return send(res, 400, "Ungültige Adresse");
    }

    if (pathname === "/health") {
      return send(res, 200, JSON.stringify({ status: "ok" }), TYPES[".json"]);
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      return send(res, 405, "Methode nicht erlaubt");
    }

    const relative = normalize(pathname).replace(/^[/\\]+/, "");
    const wantsIndex = relative === "" || relative.endsWith(sep);
    const file = join(
      PUBLIC_DIR,
      wantsIndex ? join(relative, "index.html") : relative,
    );
    if (!file.startsWith(PUBLIC_DIR)) {
      return send(res, 404, "Nicht gefunden");
    }

    try {
      const body = await readFile(file);
      const type = TYPES[extname(file)] ?? "application/octet-stream";
      return send(res, 200, req.method === "HEAD" ? undefined : body, type);
    } catch {
      return send(res, 404, "Nicht gefunden");
    }
  });
}

if (import.meta.main) {
  const host = process.env.HOST ?? "127.0.0.1";
  const port = Number(process.env.PORT ?? 3000);
  createApp().listen(port, host, () => {
    console.log(`testseite läuft auf http://${host}:${port}`);
  });
}
