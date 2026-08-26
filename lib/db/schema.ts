import {
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";

export const sites = pgTable("sites", {
  id: uuid("id").defaultRandom().primaryKey(),
  domain: text("domain").notNull(),
  ingestKey: text("ingest_key").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    url: text("url").notNull(),
    referrer: text("referrer"),
    device: text("device"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    siteIdIdx: index("site_id_idx").on(table.siteId),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
    siteCreatedAtIdx: index("events_site_created_at_idx").on(
      table.siteId,
      table.createdAt,
    ),
  }),
);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
