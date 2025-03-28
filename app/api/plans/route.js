import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SUBSCRIPTION_PLANS } from "@/lib/config/plans";

// GET /api/plans - получить список планов
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json(
      { message: "Необходима авторизация" },
      { status: 401 },
    );
  }

  return Response.json({ plans: SUBSCRIPTION_PLANS });
}

// POST /api/plans - обновить план пользователя
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json(
      { message: "Необходима авторизация" },
      { status: 401 },
    );
  }

  try {
    const { plan } = await request.json();

    // Получаем текущего пользователя
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return Response.json(
        { message: "Пользователь не найден" },
        { status: 404 },
      );
    }

    // Находим индексы текущего и нового плана
    const currentPlanIndex = SUBSCRIPTION_PLANS.findIndex(
      (p) => p.id === user.plan,
    );
    const newPlanIndex = SUBSCRIPTION_PLANS.findIndex((p) => p.id === plan);

    // Проверяем, не является ли новый план ниже текущего
    if (newPlanIndex < currentPlanIndex) {
      return Response.json(
        { message: "Нельзя выбрать план ниже текущего уровня подписки" },
        { status: 400 },
      );
    }

    const newPlan = SUBSCRIPTION_PLANS[newPlanIndex];

    // Обновляем план и списываем средства
    await db
      .update(users)
      .set({
        plan: plan,
        balance: newPlan.balance,
      })
      .where(eq(users.id, user.id));

    return Response.json({ message: "План успешно обновлен" });
  } catch (error) {
    console.error("Error updating plan:", error);
    return Response.json(
      { message: "Ошибка при обновлении плана" },
      { status: 500 },
    );
  }
}
