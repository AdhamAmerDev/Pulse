ALTER TABLE "sites"
  ADD COLUMN "ingest_key" text DEFAULT gen_random_uuid()::text NOT NULL;--> statement-breakpoint
ALTER TABLE "sites"
  ADD CONSTRAINT "sites_ingest_key_unique" UNIQUE ("ingest_key");