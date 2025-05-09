import { db } from "@/db";
import { drivers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET handler to fetch all active drivers
export async function GET() {
  try {
    const driversList = await db
      .select()
      .from(drivers)
      .where(eq(drivers.active, true))
      .orderBy(desc(drivers.updatedAt));

    return NextResponse.json(driversList);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return NextResponse.json(
      { error: "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}

// POST handler to create a new driver
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, phone, imageUrl } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Driver name is required" },
        { status: 400 }
      );
    }

    const newDriver = await db
      .insert(drivers)
      .values({
        name,
        phone,
        imageUrl,
        active: true,
      })
      .returning();

    return NextResponse.json(newDriver[0], { status: 201 });
  } catch (error) {
    console.error("Error creating driver:", error);
    return NextResponse.json(
      { error: "Failed to create driver" },
      { status: 500 }
    );
  }
}
