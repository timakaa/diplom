import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { favorites, auctions } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

// GET /api/favorites - получить избранные аукционы с пагинацией
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 },
      );
    }

    // Получаем параметры пагинации
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Получаем избранные аукционы пользователя с пагинацией
    const favoritesWithAuctions = await db
      .select({
        id: favorites.id,
        createdAt: favorites.createdAt,
        auction: {
          id: auctions.id,
          title: auctions.title,
          brand: auctions.brand,
          model: auctions.model,
          year: auctions.year,
          currentPrice: auctions.currentPrice,
          imageUrl: auctions.imageUrl,
          endDate: auctions.endDate,
          status: auctions.status,
        },
      })
      .from(favorites)
      .innerJoin(auctions, eq(favorites.auctionId, auctions.id))
      .where(eq(favorites.userId, session.user.id))
      .orderBy(desc(favorites.createdAt))
      .limit(limit)
      .offset(offset);

    // Получаем общее количество избранных для пагинации
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(favorites)
      .where(eq(favorites.userId, session.user.id))
      .then((result) => Number(result[0].count));

    return NextResponse.json({
      favorites: favoritesWithAuctions,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Ошибка при получении избранного" },
      { status: 500 },
    );
  }
}

// POST /api/favorites - добавить аукцион в избранное
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 },
      );
    }

    const data = await request.json();
    const { auctionId } = data;

    if (!auctionId) {
      return NextResponse.json(
        { error: "ID аукциона обязателен" },
        { status: 400 },
      );
    }

    // Проверяем существование аукциона
    const auction = await db.query.auctions.findFirst({
      where: eq(auctions.id, auctionId),
    });

    if (!auction) {
      return NextResponse.json({ error: "Аукцион не найден" }, { status: 404 });
    }

    // Добавляем в избранное
    await db.insert(favorites).values({
      userId: session.user.id,
      auctionId,
    });

    return NextResponse.json({ message: "Аукцион добавлен в избранное" });
  } catch (error) {
    // Проверяем, является ли ошибка нарушением уникального индекса
    if (error.code === "23505") {
      // PostgreSQL код ошибки для нарушения уникального индекса
      return NextResponse.json(
        { error: "Аукцион уже в избранном" },
        { status: 400 },
      );
    }

    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      { error: "Ошибка при добавлении в избранное" },
      { status: 500 },
    );
  }
}

// DELETE /api/favorites - удалить аукцион из избранного
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 },
      );
    }

    const data = await request.json();
    const { auctionId } = data;

    if (!auctionId) {
      return NextResponse.json(
        { error: "ID аукциона обязателен" },
        { status: 400 },
      );
    }

    // Сначала проверяем существование записи
    const favorite = await db.query.favorites.findFirst({
      where: (favorites) =>
        eq(favorites.userId, session.user.id) &&
        eq(favorites.auctionId, auctionId),
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Аукцион не найден в избранном" },
        { status: 404 },
      );
    }

    // Удаляем конкретную запись по её ID
    await db.delete(favorites).where(eq(favorites.id, favorite.id));

    return NextResponse.json({ message: "Аукцион удален из избранного" });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении из избранного" },
      { status: 500 },
    );
  }
}
