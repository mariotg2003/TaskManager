import test from "node:test";
import assert from "node:assert/strict";
import { cargar, guardar } from "../src/lib/storage.js";

test("migrates existing tasks without replacing the original and detects concurrent edits", () => {
  const original = JSON.stringify({ meses: { "2026-01": [{ id: "1", texto: "Una tarea", estado: "Ready", estimacion: "BAJO" }] } });
  let shared = null;
  globalThis.localStorage = { getItem: () => original, setItem: () => { throw new Error("No debe sobrescribirse la copia original"); } };
  globalThis.window = { taskSync: {
    read: () => shared,
    write: (expected, data) => {
      if (shared !== expected) throw new Error("Los datos cambiaron");
      shared = data;
    },
  } };
  const tasks = cargar();
  assert.equal(shared, original);
  shared = JSON.stringify({ meses: {} });
  assert.throws(() => guardar(tasks), /cambiaron/);
  assert.equal(shared, '{"meses":{}}');
  delete globalThis.window;
  delete globalThis.localStorage;
});

test("does not migrate malformed data as an empty document", () => {
  let wrote = false;
  globalThis.localStorage = { getItem: () => '{"meses":{"2026-15":[]}}' };
  globalThis.window = { taskSync: { read: () => null, write: () => { wrote = true; } } };
  assert.throws(() => cargar(), /formato válido/);
  assert.equal(wrote, false);
  delete globalThis.window;
  delete globalThis.localStorage;
});

test("does not replace corrupt browser or mobile data with an empty document", () => {
  let wrote = false;
  globalThis.window = {};
  globalThis.localStorage = { getItem: () => "{", setItem: () => { wrote = true; } };
  assert.throws(() => cargar());
  assert.equal(wrote, false);
  delete globalThis.window;
  delete globalThis.localStorage;
});

test("rejects a stale local edit after tasks change elsewhere", () => {
  let saved = JSON.stringify({ meses: {} });
  globalThis.window = {};
  globalThis.localStorage = { getItem: () => saved, setItem: (_key, value) => { saved = value; } };
  const tasks = cargar();
  saved = JSON.stringify({ meses: { "2026-01": [] } });
  assert.throws(() => guardar(tasks), /cambiaron/);
  assert.equal(saved, '{"meses":{"2026-01":[]}}');
  delete globalThis.window;
  delete globalThis.localStorage;
});
