import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db/index.js";
import { auctions, bids, auctionStatusEnum } from "@/lib/db/schema.js";
import { eq, and, count } from "drizzle-orm";

// GET /api/auctions/my/[id] - get specific user's auction
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const auctionId = parseInt(id);

    if (isNaN(auctionId)) {
      return NextResponse.json(
        { error: "Invalid auction ID" },
        { status: 400 },
      );
    }

    // Get auction and verify ownership
    const auction = await db.query.auctions.findFirst({
      where: and(
        eq(auctions.id, auctionId),
        eq(auctions.userId, session.user.id),
      ),
    });

    if (!auction) {
      return NextResponse.json(
        { error: "Auction not found or access denied" },
        { status: 404 },
      );
    }

    // Get bid count for this auction
    const bidCountResult = await db
      .select({ count: count() })
      .from(bids)
      .where(eq(bids.auctionId, auctionId));

    const bidCount = bidCountResult[0]?.count || 0;

    return NextResponse.json({
      ...auction,
      bids: bidCount,
    });
  } catch (error) {
    console.error("Error fetching auction:", error);
    return NextResponse.json(
      { error: "Failed to fetch auction" },
      { status: 500 },
    );
  }
}

// PUT /api/auctions/my/[id] - update user's auction
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const auctionId = parseInt(id);

    if (isNaN(auctionId)) {
      return NextResponse.json(
        { error: "Invalid auction ID" },
        { status: 400 },
      );
    }

    // Check if auction exists and belongs to user
    const existingAuction = await db.query.auctions.findFirst({
      where: and(
        eq(auctions.id, auctionId),
        eq(auctions.userId, session.user.id),
      ),
    });

    if (!existingAuction) {
      return NextResponse.json(
        { error: "Auction not found or access denied" },
        { status: 404 },
      );
    }

    // Check if auction has bids - if so, only allow limited updates
    const bidCountResult = await db
      .select({ count: count() })
      .from(bids)
      .where(eq(bids.auctionId, auctionId));

    const hasBids = bidCountResult[0]?.count > 0;

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
      status,
    } = body;

    // If auction has bids, only allow updating description, imageUrl, and status
    if (hasBids) {
      const allowedUpdates = {};

      if (description !== undefined)
        allowedUpdates.description = description.trim();
      if (imageUrl !== undefined)
        allowedUpdates.imageUrl = imageUrl?.trim() || null;
      if (
        status !== undefined &&
        Object.values(auctionStatusEnum).includes(status)
      ) {
        allowedUpdates.status = status;
      }

      if (Object.keys(allowedUpdates).length === 0) {
        return NextResponse.json(
          { error: "No valid updates provided" },
          { status: 400 },
        );
      }

      allowedUpdates.updatedAt = new Date();

      const [updatedAuction] = await db
        .update(auctions)
        .set(allowedUpdates)
        .where(
          and(eq(auctions.id, auctionId), eq(auctions.userId, session.user.id)),
        )
        .returning();

      return NextResponse.json({
        message:
          "Auction updated successfully (limited updates due to existing bids)",
        auction: updatedAuction,
      });
    }

    // If no bids, allow full updates
    const updates = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return NextResponse.json(
          { error: "Title is required" },
          { status: 400 },
        );
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return NextResponse.json(
          { error: "Description is required" },
          { status: 400 },
        );
      }
      updates.description = description.trim();
    }

    if (startingPrice !== undefined) {
      const parsedStartingPrice = parseFloat(startingPrice);
      if (isNaN(parsedStartingPrice) || parsedStartingPrice <= 0) {
        return NextResponse.json(
          { error: "Starting price must be a positive number" },
          { status: 400 },
        );
      }
      updates.startingPrice = parsedStartingPrice;
      updates.currentPrice = parsedStartingPrice;
    }

    if (brand !== undefined) {
      if (!brand.trim()) {
        return NextResponse.json(
          { error: "Brand is required" },
          { status: 400 },
        );
      }
      updates.brand = brand.trim();
    }

    if (model !== undefined) {
      if (!model.trim()) {
        return NextResponse.json(
          { error: "Model is required" },
          { status: 400 },
        );
      }
      updates.model = model.trim();
    }

    if (year !== undefined) {
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
      updates.year = parsedYear;
    }

    if (mileage !== undefined) {
      const parsedMileage = parseInt(mileage);
      if (isNaN(parsedMileage) || parsedMileage < 0) {
        return NextResponse.json(
          { error: "Mileage must be a non-negative number" },
          { status: 400 },
        );
      }
      updates.mileage = parsedMileage;
    }

    if (startDate !== undefined) {
      const startDateObj = new Date(startDate);
      if (isNaN(startDateObj.getTime())) {
        return NextResponse.json(
          { error: "Invalid start date format" },
          { status: 400 },
        );
      }
      if (startDateObj < new Date()) {
        return NextResponse.json(
          { error: "Start date cannot be in the past" },
          { status: 400 },
        );
      }
      updates.startDate = startDateObj;
    }

    if (endDate !== undefined) {
      const endDateObj = new Date(endDate);
      if (isNaN(endDateObj.getTime())) {
        return NextResponse.json(
          { error: "Invalid end date format" },
          { status: 400 },
        );
      }

      const startDateToCheck = updates.startDate || existingAuction.startDate;
      if (endDateObj <= startDateToCheck) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 },
        );
      }
      updates.endDate = endDateObj;
    }

    if (imageUrl !== undefined) {
      updates.imageUrl = imageUrl?.trim() || null;
    }

    if (
      status !== undefined &&
      Object.values(auctionStatusEnum).includes(status)
    ) {
      updates.status = status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid updates provided" },
        { status: 400 },
      );
    }

    updates.updatedAt = new Date();

    const [updatedAuction] = await db
      .update(auctions)
      .set(updates)
      .where(
        and(eq(auctions.id, auctionId), eq(auctions.userId, session.user.id)),
      )
      .returning();

    return NextResponse.json({
      message: "Auction updated successfully",
      auction: updatedAuction,
    });
  } catch (error) {
    console.error("Error updating auction:", error);
    return NextResponse.json(
      { error: "Failed to update auction" },
      { status: 500 },
    );
  }
}

// DELETE /api/auctions/my/[id] - delete user's auction
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const auctionId = parseInt(id);

    if (isNaN(auctionId)) {
      return NextResponse.json(
        { error: "Invalid auction ID" },
        { status: 400 },
      );
    }

    // Check if auction exists and belongs to user
    const existingAuction = await db.query.auctions.findFirst({
      where: and(
        eq(auctions.id, auctionId),
        eq(auctions.userId, session.user.id),
      ),
    });

    if (!existingAuction) {
      return NextResponse.json(
        { error: "Auction not found or access denied" },
        { status: 404 },
      );
    }

    // Check if auction has bids - if so, don't allow deletion
    const bidCountResult = await db
      .select({ count: count() })
      .from(bids)
      .where(eq(bids.auctionId, auctionId));

    const hasBids = bidCountResult[0]?.count > 0;

    if (hasBids) {
      return NextResponse.json(
        {
          error:
            "Cannot delete auction with existing bids. You can archive it instead.",
        },
        { status: 400 },
      );
    }

    // Delete the auction
    await db
      .delete(auctions)
      .where(
        and(eq(auctions.id, auctionId), eq(auctions.userId, session.user.id)),
      );

    return NextResponse.json({
      message: "Auction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting auction:", error);
    return NextResponse.json(
      { error: "Failed to delete auction" },
      { status: 500 },
    );
  }
}
