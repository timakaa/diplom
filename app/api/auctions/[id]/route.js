import { NextResponse } from "next/server";
import { db } from "@/lib/db/index.js";
import { auctions } from "@/lib/db/schema.js";
import { eq } from "drizzle-orm";

export async function GET(request, { params }) {
  try {
    const { id } = params;

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

    return NextResponse.json(auction);
  } catch (error) {
    console.error("Error fetching auction:", error);
    return NextResponse.json(
      { error: "Failed to fetch auction" },
      { status: 500 },
    );
  }
}
