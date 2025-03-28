CREATE TABLE "bids" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"auction_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_auction_id_auctions_id_fk" FOREIGN KEY ("auction_id") REFERENCES "public"."auctions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bids_user_id_idx" ON "bids" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "bids_auction_id_idx" ON "bids" USING btree ("auction_id");--> statement-breakpoint
CREATE INDEX "bids_user_time_idx" ON "bids" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "bids_auction_amount_idx" ON "bids" USING btree ("auction_id","amount");--> statement-breakpoint
CREATE INDEX "bids_status_time_idx" ON "bids" USING btree ("status","created_at");