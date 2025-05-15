// app/api/auth/logout/route.ts
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const sessionId = cookies().get("session_id")?.value;

  if (sessionId) {
    // Delete the session from database
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  // Clear the cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete("session_id");

  return response;
}
