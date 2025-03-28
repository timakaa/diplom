ALTER TABLE "user" ADD COLUMN "plan" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "balance" numeric(10, 2) DEFAULT '0' NOT NULL;