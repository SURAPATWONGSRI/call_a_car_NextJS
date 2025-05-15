import { db } from "@/db";
import { customers } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";
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
      return NextResponse.json({ error: "ต้องระบุชื่อ" }, { status: 400 });
    }

    // ตรวจสอบลูกค้าที่มีชื่อหรือเบอร์โทรซ้ำ
    const conditions = [];

    if (name) {
      conditions.push(eq(customers.name, name));
    }

    if (phone) {
      conditions.push(eq(customers.phone, phone));
    }

    // ถ้ามีทั้งชื่อและเบอร์โทร ตรวจสอบว่ามีอันใดอันหนึ่งซ้ำ
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(conditions.length > 1 ? or(...conditions) : conditions[0])
      .limit(1)
      .then((res) => res[0] || null);

    if (existingCustomer) {
      return NextResponse.json(
        { error: "ลูกค้าที่มีชื่อหรือเบอร์โทรศัพท์นี้มีอยู่แล้ว" },
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
    console.error("เกิดข้อผิดพลาดในการเพิ่มลูกค้า:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเพิ่มลูกค้า" },
      { status: 500 }
    );
  }
}
