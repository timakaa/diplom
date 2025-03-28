ALTER TABLE "auctions" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "isAdmin" boolean DEFAULT false;