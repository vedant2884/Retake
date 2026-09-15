import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "app.db");

declare global {
  var __db: DatabaseSync | undefined;
}

function createConnection() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const connection = new DatabaseSync(DB_PATH);
  connection.exec("PRAGMA journal_mode = WAL;");

  // Single local user, so no user_id anywhere in the schema. If
  // multi-user support ever comes back, these tables gain a
  // user_id column rather than needing a redesign.
  connection.exec(`
    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      challenge_type_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS challenge_agents (
      id TEXT PRIMARY KEY,
      challenge_id TEXT NOT NULL REFERENCES challenges(id),
      agent_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      selection_history TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS custom_challenges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      agent_ids TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  return connection;
}

// Cached on globalThis so dev-mode hot reloads reuse the same
// connection instead of opening a new one on every file change.
export const db = globalThis.__db ?? createConnection();

if (process.env.NODE_ENV !== "production") {
  globalThis.__db = db;
}
