CREATE INDEX "site_id_idx" ON "events" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "events" USING btree ("created_at");