import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const contents = sqliteTable("contents", {
  id: text("id").primaryKey(),  // UUID
  contentTypeId: text("content_type_id").notNull(),  // "ML-01", "ML-02", "ML-05", "VI-01"
  topic: text("topic").notNull(),
  purpose: text("purpose").notNull(),
  category: text("category"),
  level: text("level"),
  output: text("output").notNull(),  // JSON string
  validated: integer("validated", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),  // ISO timestamp
});

export const generations = sqliteTable("generations", {
  id: text("id").primaryKey(),  // UUID
  contentId: text("content_id").notNull().references(() => contents.id),
  model: text("model").notNull(),  // "mock", "claude-sonnet", etc.
  tokens: integer("tokens"),
  durationMs: integer("duration_ms"),
  createdAt: text("created_at").notNull(),
});
