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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id),
    type: text("type").notNull(),
    url: text("url").notNull(),
    referrer: text("referrer"),
    device: text("device"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    siteIdIdx: index("site_id_idx").on(table.siteId),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
  }),
);
