// `npm start`: serves the repository and opens the preview (preview/index.html) with your own plan from
// private/home.neonplan.json, in Vietnamese. Usage: node serve.mjs [port] (default 8000; --no-open to only serve).

import { exec } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const port = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 8000);
const url = `http://localhost:${port}/preview/index.html`;
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".glb": "model/gltf-binary",
};

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = join(root, path);
  if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream", "cache-control": "no-store" }).end(readFileSync(file));
});

server.on("error", (e) => {
  console.error(e.code === "EADDRINUSE" ? `Port ${port} is already in use – is the preview already running? Open ${url} or use another port: npm start -- 8080` : e.message);
  process.exit(1);
});

server.listen(port, "127.0.0.1", () => {
  const own = existsSync(join(root, "private", "home.neonplan.json"));
  console.log(`NeonPlan 3D preview: ${url}`);
  console.log(own ? "Your plan: private/home.neonplan.json (Vietnamese). The demo house: add ?demo" : "No private/home.neonplan.json yet – showing the demo house (see README).");
  console.log("Ctrl+C stops it.");
  if (!process.argv.includes("--no-open")) exec(process.platform === "win32" ? `start "" "${url}"` : `${process.platform === "darwin" ? "open" : "xdg-open"} "${url}"`);
});
