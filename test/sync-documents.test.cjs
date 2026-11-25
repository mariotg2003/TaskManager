const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const documents = require("../src/lib/sync-documents.cjs");

test("initializes once and rejects a stale concurrent write", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "workpanel-documents-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const db = path.join(dir, "documents.sqlite3");
  assert.equal(documents.read(db, "tasks"), null);
  documents.write(db, "tasks", null, '{"meses":{}}');
  const snapshot = documents.read(db, "tasks");
  documents.write(db, "tasks", snapshot, '{"meses":{"2026-01":[]}}');
  assert.throws(() => documents.write(db, "tasks", snapshot, '{"meses":{"2026-02":[]}}'), /cambiaron/);
  assert.throws(() => documents.write(db, "tasks", null, "{}"), /cambiaron/);
  assert.equal(documents.read(db, "tasks"), '{"meses":{"2026-01":[]}}');
});

test("rejects malformed or unknown documents without changing stored data", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "workpanel-documents-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const db = path.join(dir, "documents.sqlite3");
  documents.write(db, "tasks", null, "{}");
  assert.throws(() => documents.write(db, "tasks", "{}", "[]"), /no válido/);
  assert.throws(() => documents.read(db, "unknown"), /no válida/);
  assert.equal(documents.read(db, "tasks"), "{}");
});
