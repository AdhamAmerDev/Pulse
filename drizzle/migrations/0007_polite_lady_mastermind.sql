ALTER TABLE "events" DROP CONSTRAINT "events_site_id_sites_id_fk";
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sites" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sites" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "visitor_hash" text;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "ingest_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_site_created_at_idx" ON "events" USING btree ("site_id","created_at");--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_ingest_key_unique" UNIQUE("ingest_key");