import { db } from "@/db";
import { customers } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allCustomers = await db
      .select()
      .from(customers)
      .where(eq(customers.active, true))
      .orderBy(desc(customers.updatedAt));

    return NextResponse.json(allCustomers);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check for duplicate name and phone
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(
        and(
          eq(customers.name, name),
          phone ? eq(customers.phone, phone) : undefined
        )
      )
      .then((res) => res[0] || null);

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer with this name and phone already exists" },
        { status: 409 }
      );
    }

    const [newCustomer] = await db
      .insert(customers)
      .values({
        name,
        phone,
        active: true,
      })
      .returning();

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("มีข้อมูลซ้ำกันแล้วอยู่ในฐานข้อมูล :", error);
    return NextResponse.json(
      { error: "มีข้อมูลซ้ำกันแล้วอยู่ในฐานข้อมูล" },
      { status: 500 }
    );
  }
}
