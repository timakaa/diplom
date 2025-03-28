import { NextResponse } from "next/server";
import { db } from "@/lib/db/index.js";
import { auctions, bids } from "@/lib/db/schema.js";
import { desc } from "drizzle-orm";
import { eq, sql, count, inArray } from "drizzle-orm";

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query
    let query = db.select().from(auctions);

    // Add status filter if provided
    if (status) {
      query = query.where(eq(auctions.status, status));
    }

    // Add sorting and pagination
    query = query.orderBy(desc(auctions.createdAt)).limit(limit).offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(auctions)
      .then((result) => Number(result[0].count));

    // Execute query
    const results = await query;

    // Get bid counts for all fetched auctions
    const auctionIds = results.map((auction) => auction.id);

    // If we have auctions, get their bid counts
    let bidCountsMap = {};
    if (auctionIds.length > 0) {
      const bidCounts = await db
        .select({
          auctionId: bids.auctionId,
          bidCount: count(),
        })
        .from(bids)
        .where(inArray(bids.auctionId, auctionIds))
        .groupBy(bids.auctionId);

      // Create a map of auction ID to bid count
      bidCountsMap = bidCounts.reduce((map, item) => {
        map[item.auctionId] = item.bidCount;
        return map;
      }, {});
    }

    // Add bid counts to auction data
    const auctionsWithBidCounts = results.map((auction) => ({
      ...auction,
      bids: bidCountsMap[auction.id] || 0,
    }));

    return NextResponse.json({
      auctions: auctionsWithBidCounts,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return NextResponse.json(
      { error: "Failed to fetch auctions" },
      { status: 500 },
    );
  }
}
