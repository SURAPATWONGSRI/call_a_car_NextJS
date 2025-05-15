// app/api/auth/login/route.ts
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { sessions, users } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Validate credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // Create new session
    const sessionId = nanoid();
    await db.insert(sessions).values({
      id: sessionId,
      user_id: user.id,
    });

    // Session data for client-side storage
    const sessionData = {
      id: sessionId,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Create response with session cookie
    const res = NextResponse.json({ success: true, session: sessionData });
    res.cookies.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
