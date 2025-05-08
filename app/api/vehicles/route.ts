import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET endpoint to retrieve all vehicles
export async function GET() {
  try {
    const allVehicles = await db.query.vehicles.findMany({
      where: eq(vehicles.active, true),
    });

    return NextResponse.json({ vehicles: allVehicles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new vehicle
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.licensePlate || !body.brand || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert new vehicle
    const newVehicle = await db
      .insert(vehicles)
      .values({
        licensePlate: body.licensePlate,
        brand: body.brand,
        type: body.type,
        model: body.model || null,
        variant: body.variant || null,
        imageUrl: body.imageUrl || null,
        active: true,
      })
      .returning();

    return NextResponse.json({ vehicle: newVehicle[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle:", error);

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return NextResponse.json(
        { error: "License plate already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
