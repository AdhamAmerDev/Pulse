ALTER TABLE "events"
  ALTER COLUMN "created_at" TYPE timestamptz
  USING "created_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "sites"
  ALTER COLUMN "created_at" TYPE timestamptz
  USING "created_at" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "users"
  ALTER COLUMN "created_at" TYPE timestamptz
  USING "created_at" AT TIME ZONE 'UTC';