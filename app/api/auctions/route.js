import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db/index.js";
import { auctions, bids, auctionStatusEnum } from "@/lib/db/schema.js";
import { desc } from "drizzle-orm";
import { eq, sql, count, inArray, and, gte, lte, or, ilike } from "drizzle-orm";

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    // Получаем параметры фильтров цены и года
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const yearMin = searchParams.get("yearMin");
    const yearMax = searchParams.get("yearMax");

    // Получаем параметр поиска
    const searchQuery = searchParams.get("q");

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query
    let query = db.select().from(auctions);
    let conditions = [];

    // Add status filter if provided with date checking
    if (status) {
      const currentDate = new Date();

      if (status === auctionStatusEnum.ACTIVE) {
        // Для активных аукционов проверяем, что дата окончания в будущем
        conditions.push(
          and(eq(auctions.status, status), gte(auctions.endDate, currentDate)),
        );
      } else if (status === auctionStatusEnum.ARCHIVED) {
        // Для архивных аукционов показываем все архивные + активные с истекшей датой
        conditions.push(
          or(
            eq(auctions.status, auctionStatusEnum.ARCHIVED),
            and(
              eq(auctions.status, auctionStatusEnum.ACTIVE),
              lte(auctions.endDate, currentDate),
            ),
          ),
        );
      } else {
        // Для неизвестных статусов используем стандартную проверку
        conditions.push(eq(auctions.status, status));
      }
    }

    // Добавляем фильтры по цене
    if (priceMin && !isNaN(parseFloat(priceMin))) {
      conditions.push(gte(auctions.currentPrice, parseFloat(priceMin)));
    }

    if (priceMax && !isNaN(parseFloat(priceMax))) {
      conditions.push(lte(auctions.currentPrice, parseFloat(priceMax)));
    }

    // Добавляем фильтры по году
    if (yearMin && !isNaN(parseInt(yearMin))) {
      conditions.push(gte(auctions.year, parseInt(yearMin)));
    }

    if (yearMax && !isNaN(parseInt(yearMax))) {
      conditions.push(lte(auctions.year, parseInt(yearMax)));
    }

    // Добавляем поиск, если указан поисковый запрос
    if (searchQuery && searchQuery.trim() !== "") {
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

    // Применяем все условия фильтрации
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Add sorting and pagination
    query = query.orderBy(desc(auctions.createdAt)).limit(limit).offset(offset);

    // Get total count for pagination
    let totalCountQuery = db.select({ count: sql`count(*)` }).from(auctions);

    // Применяем те же фильтры для подсчета общего количества
    if (conditions.length > 0) {
      totalCountQuery = totalCountQuery.where(and(...conditions));
    }

    const totalCount = await totalCountQuery.then((result) =>
      Number(result[0].count),
    );

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

// POST /api/auctions - create a new auction
export async function POST(request) {
  // Check authentication
  const session = await getServerSession(authOptions);
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
      startDate,
      endDate,
      brand,
      model,
      year,
      mileage,
      imageUrl,
    } = body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !startingPrice ||
      !startDate ||
      !endDate ||
      !brand ||
      !model ||
      !year ||
      !mileage
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 },
      );
    }

    // Validate data types and ranges
    const parsedStartingPrice = parseFloat(startingPrice);
    const parsedYear = parseInt(year);
    const parsedMileage = parseInt(mileage);

    if (isNaN(parsedStartingPrice) || parsedStartingPrice <= 0) {
      return NextResponse.json(
        { error: "Starting price must be a positive number" },
        { status: 400 },
      );
    }

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

    if (isNaN(parsedMileage) || parsedMileage < 0) {
      return NextResponse.json(
        { error: "Mileage must be a non-negative number" },
        { status: 400 },
      );
    }

    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const now = new Date();

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 },
      );
    }

    if (startDateObj < now) {
      return NextResponse.json(
        { error: "Start date cannot be in the past" },
        { status: 400 },
      );
    }

    if (endDateObj <= startDateObj) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 },
      );
    }

    // Create the auction
    const [newAuction] = await db
      .insert(auctions)
      .values({
        userId: session.user.id,
        title: title.trim(),
        description: description.trim(),
        startingPrice: parsedStartingPrice,
        currentPrice: parsedStartingPrice,
        startDate: startDateObj,
        endDate: endDateObj,
        brand: brand.trim(),
        model: model.trim(),
        year: parsedYear,
        mileage: parsedMileage,
        imageUrl: imageUrl?.trim() || null,
        status: auctionStatusEnum.ACTIVE,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Auction created successfully",
        auction: newAuction,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating auction:", error);
    return NextResponse.json(
      { error: "Failed to create auction" },
      { status: 500 },
    );
  }
}
