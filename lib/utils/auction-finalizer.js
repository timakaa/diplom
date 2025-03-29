import { db } from "../db/index.js";
import {
  auctions,
  bids,
  auctionStatusEnum,
  bidStatusEnum,
} from "../db/schema.js";
import { eq, lt, and } from "drizzle-orm";

/**
 * Finalize completed auctions:
 * 1. Find auctions where end date has passed but status is still ACTIVE
 * 2. Update auction status to ARCHIVED
 * 3. Update the highest bid status to WON
 * 4. Update all other bids for this auction to EXPIRED
 */
export async function finalizeCompletedAuctions() {
  try {
    console.log("Starting auction finalization process...");
    const now = new Date();

    // Find auctions that have ended but are still active
    const completedAuctions = await db
      .select()
      .from(auctions)
      .where(
        and(
          lt(auctions.endDate, now),
          eq(auctions.status, auctionStatusEnum.ACTIVE),
        ),
      );

    console.log(`Found ${completedAuctions.length} auctions to finalize`);

    // Process each completed auction
    for (const auction of completedAuctions) {
      console.log(`Processing auction #${auction.id}: ${auction.title}`);

      // Wrap in transaction to ensure atomicity
      await db.transaction(async (tx) => {
        // 1. Set the auction status to ARCHIVED
        await tx
          .update(auctions)
          .set({
            status: auctionStatusEnum.ARCHIVED,
            updatedAt: new Date(),
          })
          .where(eq(auctions.id, auction.id));

        // 2. Get all bids for this auction
        const auctionBids = await tx
          .select()
          .from(bids)
          .where(eq(bids.auctionId, auction.id));

        // Сортируем ставки в JavaScript для уверенности в правильном порядке
        auctionBids.sort((a, b) => {
          // Преобразуем в числа, чтобы корректно сравнивать
          const amountA = parseFloat(a.amount);
          const amountB = parseFloat(b.amount);

          // Сортируем по убыванию (от большего к меньшему)
          return amountB - amountA;
        });

        console.log("Sorted bids by amount (desc):");
        auctionBids.forEach((bid) => {
          console.log(`Bid ID: ${bid.id}, Amount: ${bid.amount}`);
        });

        // 3. If there are bids, update their statuses
        if (auctionBids.length > 0) {
          // The highest bid (first in the sorted array) is the winner
          const winningBid = auctionBids[0];

          // Update winning bid to WON
          await tx
            .update(bids)
            .set({
              status: bidStatusEnum.WON,
              updatedAt: new Date(),
            })
            .where(eq(bids.id, winningBid.id));

          // Update all other bids to EXPIRED
          if (auctionBids.length > 1) {
            const otherBidIds = auctionBids.slice(1).map((bid) => bid.id);

            // Update in batches if needed
            for (const bidId of otherBidIds) {
              await tx
                .update(bids)
                .set({
                  status: bidStatusEnum.EXPIRED,
                  updatedAt: new Date(),
                })
                .where(eq(bids.id, bidId));
            }
          }
        }
      });

      console.log(`Auction #${auction.id} finalized successfully`);
    }

    return completedAuctions.length;
  } catch (error) {
    console.error("Error finalizing auctions:", error);
    throw error;
  }
}
