const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const MAX_BYTES = 16 * 1024 * 1024;
const SECTIONS = new Set(["tasks", "contability"]);

function open(databasePath) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  db.exec("PRAGMA busy_timeout = 5000; CREATE TABLE IF NOT EXISTS sync_documents (section TEXT PRIMARY KEY, data TEXT NOT NULL);");
  return db;
}

function validateSection(section) {
  if (!SECTIONS.has(section)) throw new Error("Sección de sincronización no válida.");
}

function read(databasePath, section) {
  validateSection(section);
  const db = open(databasePath);
  try {
    return db.prepare("SELECT data FROM sync_documents WHERE section = ?").get(section)?.data ?? null;
  } finally { db.close(); }
}

function write(databasePath, section, expected, data) {
  validateSection(section);
  if ((expected !== null && typeof expected !== "string") || typeof data !== "string" ||
      Buffer.byteLength(data, "utf8") > MAX_BYTES) throw new Error("Documento de sincronización no válido.");
  const parsed = JSON.parse(data);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Documento de sincronización no válido.");
  const db = open(databasePath);
  try {
    const result = expected === null
      ? db.prepare("INSERT OR IGNORE INTO sync_documents (section, data) VALUES (?, ?)").run(section, data)
      : db.prepare("UPDATE sync_documents SET data = ? WHERE section = ? AND data = ?").run(data, section, expected);
    if (!result.changes) throw new Error("Los datos cambiaron en otra aplicación. Recarga antes de guardar.");
  } finally { db.close(); }
}

module.exports = { read, write };
