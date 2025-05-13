import { db } from "@/db";
import { drivers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET handler to fetch a single driver by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid driver ID" }, { status: 400 });
    }

    const driver = await db
      .select()
      .from(drivers)
      .where(eq(drivers.id, id))
      .limit(1);

    if (!driver || driver.length === 0 || !driver[0].active) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    return NextResponse.json(driver[0]);
  } catch (error) {
    console.error("Error fetching driver:", error);
    return NextResponse.json(
      { error: "Failed to fetch driver" },
      { status: 500 }
    );
  }
}

// PUT handler to update a driver
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid driver ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, phone, imageUrl } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Driver name is required" },
        { status: 400 }
      );
    }

    // Check if driver exists and is active
    const existingDriver = await db
      .select()
      .from(drivers)
      .where(eq(drivers.id, id))
      .limit(1);

    if (
      !existingDriver ||
      existingDriver.length === 0 ||
      !existingDriver[0].active
    ) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    const updatedDriver = await db
      .update(drivers)
      .set({
        name,
        phone,
        imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(drivers.id, id))
      .returning();

    return NextResponse.json(updatedDriver[0]);
  } catch (error) {
    console.error("Error updating driver:", error);
    return NextResponse.json(
      { error: "Failed to update driver" },
      { status: 500 }
    );
  }
}

// DELETE handler to perform a soft delete
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid driver ID" }, { status: 400 });
    }

    // Check if driver exists and is active
    const existingDriver = await db
      .select()
      .from(drivers)
      .where(eq(drivers.id, id))
      .limit(1);

    if (
      !existingDriver ||
      existingDriver.length === 0 ||
      !existingDriver[0].active
    ) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    // Soft delete by setting active to false
    await db
      .update(drivers)
      .set({
        active: false,
        updatedAt: new Date(),
      })
      .where(eq(drivers.id, id));

    return NextResponse.json(
      { message: "Driver deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting driver:", error);
    return NextResponse.json(
      { error: "Failed to delete driver" },
      { status: 500 }
    );
  }
}
