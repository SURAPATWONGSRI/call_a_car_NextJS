import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Helper function to safely get params
async function getParams(paramsOrPromise: any): Promise<any> {
  return paramsOrPromise instanceof Promise
    ? await paramsOrPromise
    : paramsOrPromise;
}

// GET a single vehicle by ID
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Safely get params, awaiting if necessary
    const params = await getParams(context.params);
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid vehicle ID" },
        { status: 400 }
      );
    }

    const vehicle = await db.query.vehicles.findFirst({
      where: eq(vehicles.id, id),
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ vehicle }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

// PUT to update a vehicle
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Safely get params, awaiting if necessary
    const params = await getParams(context.params);
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid vehicle ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updatedVehicle = await db
      .update(vehicles)
      .set({
        licensePlate: body.licensePlate,
        brand: body.brand,
        type: body.type,
        imageUrl: body.imageUrl,
        active: body.active !== undefined ? body.active : true,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, id))
      .returning();

    if (!updatedVehicle.length) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ vehicle: updatedVehicle[0] }, { status: 200 });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

// DELETE a vehicle (soft delete)
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Safely get params, awaiting if necessary
    const params = await getParams(context.params);
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid vehicle ID" },
        { status: 400 }
      );
    }

    // Soft delete by setting active to false
    const deletedVehicle = await db
      .update(vehicles)
      .set({
        active: false,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, id))
      .returning();

    if (!deletedVehicle.length) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}
