import { NextResponse } from "next/server";
import { db } from "@/lib/db/index.js";
import { auctions } from "@/lib/db/schema.js";
import { desc } from "drizzle-orm";
import { eq, sql } from "drizzle-orm";

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

    return NextResponse.json({
      auctions: results,
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
