import { db } from "@/db";
import { customers } from "@/db/schema";
import { and, eq, not, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET specific customer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .then((res) => res[0] || null);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Failed to fetch customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

// UPDATE customer by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, phone, imageUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check for duplicate name and phone but exclude current customer
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(
        and(
          eq(customers.name, name),
          phone ? eq(customers.phone, phone) : undefined,
          not(eq(customers.id, id))
        )
      )
      .then((res) => res[0] || null);

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer with this name and phone already exists" },
        { status: 409 }
      );
    }

    const [updatedCustomer] = await db
      .update(customers)
      .set({
        name,
        phone,
        updatedAt: sql`(NOW() AT TIME ZONE 'Asia/Bangkok')`,
      })
      .where(eq(customers.id, id))
      .returning();

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Failed to update customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// SOFT DELETE customer by ID (set active to false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    const [deletedCustomer] = await db
      .update(customers)
      .set({
        active: false,
      })
      .where(eq(customers.id, id))
      .returning();

    if (!deletedCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Customer successfully deleted" });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
