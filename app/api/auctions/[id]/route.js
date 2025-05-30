import { NextResponse } from "next/server";
import { db } from "@/lib/db/index.js";
import { auctions, bids } from "@/lib/db/schema.js";
import { eq, count } from "drizzle-orm";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Get auction by ID
    const auction = await db
      .select()
      .from(auctions)
      .where(eq(auctions.id, id))
      .limit(1)
      .then((results) => results[0]);

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    // Get bid count for this auction
    const bidCountResult = await db
      .select({ value: count() })
      .from(bids)
      .where(eq(bids.auctionId, parseInt(id)));

    const bidCount = bidCountResult[0].value;

    // Add bid count to auction data
    const auctionWithBidCount = {
      ...auction,
      bids: bidCount,
    };

    return NextResponse.json(auctionWithBidCount);
  } catch (error) {
    console.error("Error fetching auction:", error);
    return NextResponse.json(
      { error: "Failed to fetch auction" },
      { status: 500 },
    );
  }
}
