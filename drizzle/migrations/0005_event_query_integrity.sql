ALTER TABLE "events"
  DROP CONSTRAINT "events_site_id_sites_id_fk";--> statement-breakpoint
ALTER TABLE "events"
  ADD CONSTRAINT "events_site_id_sites_id_fk"
  FOREIGN KEY ("site_id") REFERENCES "sites"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;--> statement-breakpoint
CREATE INDEX "events_site_created_at_idx"
  ON "events" USING btree ("site_id", "created_at");