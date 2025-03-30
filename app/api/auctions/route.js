import { NextResponse } from "next/server";
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
