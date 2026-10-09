import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/server.js";

let server;
let base;

before(async () => {
  server = createApp();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test("/health meldet ok", async () => {
  const response = await fetch(`${base}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("Startseite wird ausgeliefert", async () => {
  const response = await fetch(`${base}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /ELFIN Testseite/);
});

test("Dateien außerhalb von public/ sind nicht erreichbar", async () => {
  const response = await fetch(`${base}/..%2Fserver.js`);
  assert.equal(response.status, 404);
});

test("unbekannte Seiten liefern 404", async () => {
  const response = await fetch(`${base}/gibt-es-nicht`);
  assert.equal(response.status, 404);
});
