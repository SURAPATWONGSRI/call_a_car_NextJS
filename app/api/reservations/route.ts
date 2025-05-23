import { db } from "@/db";
import { reservations } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/reservations - Get all reservations
export async function GET(request: NextRequest) {
  try {
    // Get the includeInactive query parameter
    const url = new URL(request.url);
    const includeInactive = url.searchParams.get("includeInactive") === "true";

    // Build the query
    let query = db.query.reservations.findMany({
      orderBy: [desc(reservations.createdAt)],
      with: {
        customer: true,
        vehicle: true,
        driver: true,
      },
    });

    // Filter out inactive records unless specifically requested
    if (!includeInactive) {
      query = db.query.reservations.findMany({
        where: eq(reservations.active, true),
        orderBy: [desc(reservations.createdAt)],
        with: {
          customer: true,
          vehicle: true,
          driver: true,
        },
      });
    }

    const allReservations = await query;

    return NextResponse.json(allReservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    // Add more detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: "Failed to fetch reservations",
        details: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}

// POST /api/reservations - Create a new reservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservedByName, date, timeStart, timeEnd } = body;

    if (!reservedByName || !date || !timeStart || !timeEnd) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const customerId = body.customerId;

    const newReservation = await db
      .insert(reservations)
      .values({
        customerId,
        reservedByName,
        date: sql`(NOW() AT TIME ZONE 'Asia/Bangkok')`,
        timeStart,
        timeEnd,
        purpose: body.purpose || null,
        pickupLocation: body.pickupLocation || null,
        dropoffLocation: body.dropoffLocation || null,
        vehicleId: body.vehicleId || null,
        driverId: body.driverId || null,
        passengerCount: body.passengerCount || null,
        passengerInfo: body.passengerInfo || null,
        imageUrl: body.imageUrl || null,
      })
      .returning();

    return NextResponse.json(newReservation[0], { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: "Failed to create reservation",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
