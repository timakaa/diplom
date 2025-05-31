CREATE INDEX "auctions_created_at_idx" ON "auctions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "auctions_status_idx" ON "auctions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "auctions_status_created_at_idx" ON "auctions" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "auctions_user_id_idx" ON "auctions" USING btree ("user_id");