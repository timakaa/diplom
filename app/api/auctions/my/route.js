import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/index.js";
import { auctions, bids, auctionStatusEnum } from "@/lib/db/schema.js";
import { eq, and, desc, count, inArray } from "drizzle-orm";

// GET /api/auctions/my - get current user's auctions
export async function GET(request) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query for user's auctions
    let query = db
      .select()
      .from(auctions)
      .where(eq(auctions.userId, session.user.id));

    // Add status filter if provided
    if (status && Object.values(auctionStatusEnum).includes(status)) {
      query = query.where(
        and(eq(auctions.userId, session.user.id), eq(auctions.status, status)),
      );
    }

    // Add sorting and pagination
    query = query.orderBy(desc(auctions.createdAt)).limit(limit).offset(offset);

    // Get total count for pagination
    let totalCountQuery = db
      .select({ count: count() })
      .from(auctions)
      .where(eq(auctions.userId, session.user.id));

    if (status && Object.values(auctionStatusEnum).includes(status)) {
      totalCountQuery = totalCountQuery.where(
        and(eq(auctions.userId, session.user.id), eq(auctions.status, status)),
      );
    }

    const [results, totalCountResult] = await Promise.all([
      query,
      totalCountQuery,
    ]);

    const totalCount = totalCountResult[0].count;

    // Get bid counts for all fetched auctions
    const auctionIds = results.map((auction) => auction.id);

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
    console.error("Error fetching user auctions:", error);
    return NextResponse.json(
      { error: "Failed to fetch user auctions" },
      { status: 500 },
    );
  }
}
