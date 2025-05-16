// app/api/auth/logout/route.ts
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const sessionId = cookies().get("session_id")?.value;

  try {
    if (sessionId) {
      // Delete the session from database
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    }

    // Clear the cookie with proper settings to ensure it's removed
    const response = NextResponse.json({ success: true });

    response.cookies.delete("session_id", {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { success: false, error: "Failed to logout" },
      { status: 500 }
    );
  }
}
