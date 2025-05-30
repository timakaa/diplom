import { db } from "@/lib/db";
import { bids, bidStatusEnum } from "@/lib/db/schema";
import { eq, and, desc, count } from "drizzle-orm";

/**
 * GET /api/bids/auction/[id] - Get all bids for a specific auction
 * This endpoint returns all bids for a specific auction, with pagination options
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    // Parse pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const status = searchParams.get("status")?.toUpperCase();

    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;

    // Create base query
    let query = db
      .select()
      .from(bids)
      .where(eq(bids.auctionId, parseInt(id)))
      .orderBy(desc(bids.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Apply status filter if provided
    if (status && Object.values(bidStatusEnum).includes(status)) {
      query = query.where(eq(bids.status, status));
    }

    // Execute query
    const auctionBids = await query;

    // Get total count for pagination
    const totalCountResult = await db
      .select({ value: count() })
      .from(bids)
      .where(eq(bids.auctionId, parseInt(id)));

    const totalCount = totalCountResult[0].value;

    // Return bids with pagination info
    return Response.json({
      bids: auctionBids,
      pagination: {
        total: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching bids for auction:", error);
    return Response.json(
      { error: "Произошла ошибка при получении ставок" },
      { status: 500 },
    );
  }
}
