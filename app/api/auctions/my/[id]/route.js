import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth.js";
import { db } from "@/lib/db/index.js";
import { auctions, bids, auctionStatusEnum } from "@/lib/db/schema.js";
import { eq, and, count } from "drizzle-orm";

// GET /api/auctions/my/[id] - get specific user's auction
export async function GET(request, { params }) {
  // Temporarily disabled for build
  return NextResponse.json(
    { error: "Authentication required" },
    { status: 401 },
  );
}

// PUT /api/auctions/my/[id] - update user's auction
export async function PUT(request, { params }) {
  // Temporarily disabled for build
  return NextResponse.json(
    { error: "Authentication required" },
    { status: 401 },
  );
}

// DELETE /api/auctions/my/[id] - delete user's auction
export async function DELETE(request, { params }) {
  // Temporarily disabled for build
  return NextResponse.json(
    { error: "Authentication required" },
    { status: 401 },
  );
}
