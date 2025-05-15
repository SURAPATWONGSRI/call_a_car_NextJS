// app/api/auth/register/route.ts
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = nanoid();
    await db.insert(users).values({
      id,
      email,
      password: hashedPassword,
      role: role || "user", // default role is "user"
    });

    return NextResponse.json({ success: true, userId: id }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
