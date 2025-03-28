import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { bids, auctions, bidStatusEnum, users } from "@/lib/db/schema";
import { eq, and, desc, count } from "drizzle-orm";

const MIN_BID_INCREMENT = 1000; // Минимальный шаг ставки в рублях

// POST /api/bids - создать новую ставку
export async function POST(request) {
  // Проверка аутентификации
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  try {
    const { auctionId, amount } = await request.json();

    // Проверка обязательных полей
    if (!auctionId || !amount) {
      return Response.json(
        { error: "ID аукциона и сумма ставки обязательны" },
        { status: 400 },
      );
    }

    // Проверка существования аукциона
    const auction = await db.query.auctions.findFirst({
      where: eq(auctions.id, auctionId),
    });

    if (!auction) {
      return Response.json({ error: "Аукцион не найден" }, { status: 404 });
    }

    // Проверка статуса аукциона (должен быть активен)
    if (auction.status !== "active") {
      return Response.json(
        { error: "Невозможно сделать ставку на неактивный аукцион" },
        { status: 400 },
      );
    }

    // Проверка времени аукциона
    const now = new Date();
    if (now > new Date(auction.endDate)) {
      return Response.json({ error: "Аукцион уже завершен" }, { status: 400 });
    }

    if (now < new Date(auction.startDate)) {
      return Response.json(
        { error: "Аукцион еще не начался" },
        { status: 400 },
      );
    }

    // Проверка, что ставка больше текущей цены
    if (parseFloat(amount) <= parseFloat(auction.currentPrice)) {
      return Response.json(
        { error: "Ставка должна быть больше текущей цены" },
        { status: 400 },
      );
    }

    // Проверка минимального шага ставки
    const increment = parseFloat(amount) - parseFloat(auction.currentPrice);
    if (increment < MIN_BID_INCREMENT) {
      return Response.json(
        {
          error: `Минимальный шаг ставки составляет ${MIN_BID_INCREMENT} рублей`,
        },
        { status: 400 },
      );
    }

    // Проверка баланса пользователя
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user || parseFloat(user.balance) < parseFloat(amount)) {
      return Response.json(
        { error: "Недостаточно средств на балансе" },
        { status: 400 },
      );
    }

    // Начинаем транзакцию для атомарного обновления
    const result = await db.transaction(async (tx) => {
      // 1. Обновляем статус всех текущих активных ставок на OUTBID
      await tx
        .update(bids)
        .set({
          status: bidStatusEnum.OUTBID,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(bids.auctionId, auctionId),
            eq(bids.status, bidStatusEnum.ACTIVE),
          ),
        );

      // 2. Создаем новую ставку
      const [newBid] = await tx
        .insert(bids)
        .values({
          userId: session.user.id,
          auctionId: auctionId,
          amount: amount,
          status: bidStatusEnum.ACTIVE,
        })
        .returning();

      // 3. Обновляем текущую цену аукциона
      await tx
        .update(auctions)
        .set({
          currentPrice: amount,
          updatedAt: new Date(),
        })
        .where(eq(auctions.id, auctionId));

      return newBid;
    });

    return Response.json({
      message: "Ставка успешно создана",
      bid: result,
    });
  } catch (error) {
    console.error("Error creating bid:", error);
    return Response.json(
      { error: "Произошла ошибка при создании ставки" },
      { status: 500 },
    );
  }
}

// GET /api/bids - получить ставки пользователя с пагинацией
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const auctionId = searchParams.get("auctionId");
    const status = searchParams.get("status");

    const offset = (page - 1) * pageSize;

    // Создаем базовый запрос для фильтрации
    let query = db
      .select()
      .from(bids)
      .orderBy(desc(bids.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Применяем фильтры
    let whereConditions = [];

    // Фильтр по пользователю (по умолчанию показываем только ставки текущего пользователя)
    whereConditions.push(eq(bids.userId, session.user.id));

    // Если указан auctionId, фильтруем по нему
    if (auctionId) {
      whereConditions.push(eq(bids.auctionId, auctionId));
    }

    // Если указан status, фильтруем по нему
    if (status && Object.values(bidStatusEnum).includes(status)) {
      whereConditions.push(eq(bids.status, status));
    }

    // Применяем все условия с AND
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    // Выполняем запрос
    const userBids = await query;

    // Получаем общее количество ставок для пагинации
    const totalCountQuery = db.select({ count: count() }).from(bids);

    if (whereConditions.length > 0) {
      totalCountQuery.where(and(...whereConditions));
    }

    const totalCount = await totalCountQuery;

    return Response.json({
      bids: userBids,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount[0].count / pageSize),
        pageSize,
        totalCount: totalCount[0].count,
      },
    });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return Response.json(
      { error: "Произошла ошибка при получении ставок" },
      { status: 500 },
    );
  }
}
