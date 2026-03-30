import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function init() {
  // Create tables if not exist
  db.run(sql`
    CREATE TABLE IF NOT EXISTS contents (
      id TEXT PRIMARY KEY,
      content_type_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      purpose TEXT NOT NULL,
      category TEXT,
      level TEXT,
      output TEXT NOT NULL,
      validated INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);
  
  db.run(sql`
    CREATE TABLE IF NOT EXISTS generations (
      id TEXT PRIMARY KEY,
      content_id TEXT NOT NULL REFERENCES contents(id),
      model TEXT NOT NULL,
      tokens INTEGER,
      duration_ms INTEGER,
      created_at TEXT NOT NULL
    )
  `);
  
  console.log("Database initialized!");
}

init().catch(console.error);
