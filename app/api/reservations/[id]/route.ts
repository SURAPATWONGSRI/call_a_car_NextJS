import { db } from "@/db";
import { reservations } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/reservations/[id] - Get a specific reservation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const url = new URL(request.url);
    const includeInactive = url.searchParams.get("includeInactive") === "true";

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid reservation ID" },
        { status: 400 }
      );
    }

    // Add condition for active flag unless includeInactive is true
    const whereCondition = includeInactive
      ? eq(reservations.id, id)
      : and(eq(reservations.id, id), eq(reservations.active, true));

    const reservation = await db.query.reservations.findFirst({
      where: whereCondition,
      with: {
        customer: true,
        vehicle: true,
        driver: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservation" },
      { status: 500 }
    );
  }
}

// PUT /api/reservations/[id] - Update a reservation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    console.log(`Processing update for reservation ID: ${id}`);

    if (isNaN(id)) {
      console.log("Invalid ID format:", params.id);
      return NextResponse.json(
        { error: "Invalid reservation ID" },
        { status: 400 }
      );
    }

    // Parse and log the entire request body
    let body;
    try {
      body = await request.json();
      console.log(
        `Full request body for reservation ${id}:`,
        JSON.stringify(body)
      );
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Check if reservation exists
    const existingReservation = await db.query.reservations.findFirst({
      where: eq(reservations.id, id),
    });

    if (!existingReservation) {
      console.log(`Reservation with ID ${id} not found`);
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    console.log(`Found existing reservation:`, existingReservation);

    // Prepare update data
    const updateData: any = {};

    // Only update fields that are provided in the request
    if (body.customerId !== undefined) updateData.customerId = body.customerId;
    if (body.reservedByName !== undefined)
      updateData.reservedByName = body.reservedByName;
    if (body.date !== undefined) updateData.date = body.date;
    if (body.timeStart !== undefined) updateData.timeStart = body.timeStart;
    if (body.timeEnd !== undefined) updateData.timeEnd = body.timeEnd;
    if (body.purpose !== undefined) updateData.purpose = body.purpose;
    if (body.pickupLocation !== undefined)
      updateData.pickupLocation = body.pickupLocation;
    if (body.dropoffLocation !== undefined)
      updateData.dropoffLocation = body.dropoffLocation;
    if (body.vehicleId !== undefined) updateData.vehicleId = body.vehicleId;
    if (body.driverId !== undefined) updateData.driverId = body.driverId;
    if (body.passengerCount !== undefined)
      updateData.passengerCount = body.passengerCount;
    if (body.passengerInfo !== undefined)
      updateData.passengerInfo = body.passengerInfo;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;

    // Handle status update specifically
    if (body.status !== undefined) {
      console.log(
        `Updating status from "${existingReservation.status || "null"}" to "${
          body.status
        }"`
      );

      // Map frontend status values to database enum values
      // This mapping should match the exact enum values in your database
      let dbStatus;
      switch (body.status.toLowerCase()) {
        case "success":
        case "ยืนยันแล้ว":
          dbStatus = "confirmed"; // Assuming this is the enum value in your database
          break;
        case "ยกเลิก":
          dbStatus = "cancelled"; // Assuming this is the enum value in your database
          break;
        case "pending":
        case "รอยืนยัน":
          dbStatus = "pending"; // Assuming this is the enum value in your database
          break;
        default:
          // If unknown status, use the original value and let DB validate
          dbStatus = body.status;
      }

      updateData.status = dbStatus;
      console.log(`Mapped status for database: "${dbStatus}"`);
    }

    // Add updated_at timestamp
    updateData.updatedAt = sql`(NOW() AT TIME ZONE 'Asia/Bangkok')`;

    console.log("Final update data:", updateData);

    try {
      const updatedReservation = await db
        .update(reservations)
        .set(updateData)
        .where(eq(reservations.id, id))
        .returning();

      console.log("Database update successful:", updatedReservation[0]);

      return NextResponse.json(updatedReservation[0]);
    } catch (dbError) {
      console.error("Database update error:", dbError);
      return NextResponse.json(
        {
          error: "Database update failed",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json(
      {
        error: "Failed to update reservation",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/reservations/[id] - Delete a reservation (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const url = new URL(request.url);
    const hardDelete = url.searchParams.get("hardDelete") === "true";

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid reservation ID" },
        { status: 400 }
      );
    }

    // Check if reservation exists
    const existingReservation = await db.query.reservations.findFirst({
      where: eq(reservations.id, id),
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    if (hardDelete) {
      // Perform actual deletion if hardDelete is specified
      await db.delete(reservations).where(eq(reservations.id, id));
    } else {
      // Perform soft delete by default (set active to false)
      await db
        .update(reservations)
        .set({
          active: false,
          updatedAt: sql`(NOW() AT TIME ZONE 'Asia/Bangkok')`,
        })
        .where(eq(reservations.id, id));
    }

    return NextResponse.json({
      success: true,
      message: hardDelete
        ? "Reservation permanently deleted"
        : "Reservation deleted successfully (soft delete)",
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 }
    );
  }
}
