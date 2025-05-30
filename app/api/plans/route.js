import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/index.js";
import { users } from "@/lib/db/schema.js";
import { eq } from "drizzle-orm";

// GET /api/plans - get user's current plan
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      plan: user.plan || "free",
      balance: user.balance || 0,
    });
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch user plan" },
      { status: 500 },
    );
  }
}

// POST /api/plans - update user's plan
export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    const { plan } = await request.json();

    if (!plan) {
      return NextResponse.json({ error: "Plan is required" }, { status: 400 });
    }

    // Validate plan
    const validPlans = ["free", "basic", "premium"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Update user plan
    const [updatedUser] = await db
      .update(users)
      .set({
        plan,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning();

    return NextResponse.json({
      message: "Plan updated successfully",
      plan: updatedUser.plan,
      balance: updatedUser.balance,
    });
  } catch (error) {
    console.error("Error updating user plan:", error);
    return NextResponse.json(
      { error: "Failed to update user plan" },
      { status: 500 },
    );
  }
}
