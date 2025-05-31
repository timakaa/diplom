import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/index.js";
import { auctions, bids, auctionStatusEnum } from "@/lib/db/schema.js";
import {
  eq,
  and,
  desc,
  count,
  inArray,
  gte,
  lte,
  ilike,
  or,
} from "drizzle-orm";

// GET /api/auctions - get all auctions with filtering and pagination
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const status = searchParams.get("status");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const yearMin = searchParams.get("yearMin");
    const yearMax = searchParams.get("yearMax");
    const searchQuery = searchParams.get("q");

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build base query
    let query = db.select().from(auctions);
    let countQuery = db.select({ count: count() }).from(auctions);

    // Build where conditions
    const conditions = [];

    // Status filter
    if (status && Object.values(auctionStatusEnum).includes(status)) {
      conditions.push(eq(auctions.status, status));
    }

    // Price range filter
    if (priceMin && !isNaN(parseFloat(priceMin))) {
      conditions.push(gte(auctions.currentPrice, priceMin));
    }
    if (priceMax && !isNaN(parseFloat(priceMax))) {
      conditions.push(lte(auctions.currentPrice, priceMax));
    }

    // Year range filter
    if (yearMin && !isNaN(parseInt(yearMin))) {
      conditions.push(gte(auctions.year, parseInt(yearMin)));
    }
    if (yearMax && !isNaN(parseInt(yearMax))) {
      conditions.push(lte(auctions.year, parseInt(yearMax)));
    }

    // Search query filter
    if (searchQuery && searchQuery.trim()) {
      const searchTerm = `%${searchQuery.trim()}%`;
      conditions.push(
        or(
          ilike(auctions.title, searchTerm),
          ilike(auctions.description, searchTerm),
          ilike(auctions.brand, searchTerm),
          ilike(auctions.model, searchTerm),
        ),
      );
    }

    // Apply conditions if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }

    // Add sorting and pagination
    query = query
      .orderBy(desc(auctions.createdAt), desc(auctions.id))
      .limit(limit)
      .offset(offset);

    // Execute queries
    const [results, totalCountResult] = await Promise.all([query, countQuery]);

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
    console.error("Error fetching auctions:", error);
    return NextResponse.json(
      { error: "Failed to fetch auctions" },
      { status: 500 },
    );
  }
}

// POST /api/auctions - create new auction
export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      startingPrice,
      endDate,
      brand,
      model,
      year,
      mileage,
      imageUrl,
    } = body;

    // Validation
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 },
      );
    }

    const parsedStartingPrice = parseFloat(startingPrice);
    if (isNaN(parsedStartingPrice) || parsedStartingPrice <= 0) {
      return NextResponse.json(
        { error: "Starting price must be a positive number" },
        { status: 400 },
      );
    }

    if (!brand?.trim()) {
      return NextResponse.json({ error: "Brand is required" }, { status: 400 });
    }

    if (!model?.trim()) {
      return NextResponse.json({ error: "Model is required" }, { status: 400 });
    }

    const parsedYear = parseInt(year);
    if (
      isNaN(parsedYear) ||
      parsedYear < 1900 ||
      parsedYear > new Date().getFullYear() + 1
    ) {
      return NextResponse.json(
        { error: "Year must be a valid year" },
        { status: 400 },
      );
    }

    const parsedMileage = parseInt(mileage);
    if (isNaN(parsedMileage) || parsedMileage < 0) {
      return NextResponse.json(
        { error: "Mileage must be a non-negative number" },
        { status: 400 },
      );
    }

    // Date validation
    const endDateObj = new Date(endDate);

    if (isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 },
      );
    }

    // Create auction
    const [newAuction] = await db
      .insert(auctions)
      .values({
        title: title.trim(),
        description: description.trim(),
        startingPrice: parsedStartingPrice,
        startDate: new Date(),
        currentPrice: parsedStartingPrice,
        endDate: endDateObj,
        brand: brand.trim(),
        model: model.trim(),
        year: parsedYear,
        mileage: parsedMileage,
        imageUrl: imageUrl?.trim() || null,
        userId: session.user.id,
        status: "active",
      })
      .returning();

    return NextResponse.json({
      message: "Auction created successfully",
      auction: newAuction,
    });
  } catch (error) {
    console.error("Error creating auction:", error);
    return NextResponse.json(
      { error: "Failed to create auction" },
      { status: 500 },
    );
  }
}
