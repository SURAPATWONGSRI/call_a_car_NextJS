import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define protected and public routes
const PROTECTED_PATHS = ["/admin", "/dashboard", "/profile"];
const PUBLIC_PATHS = ["/", "/register", "/api"];
const AUTH_PATH = "/"; // Login page path

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session_id");
  const isAuthenticated = !!sessionCookie;

  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Redirect to login if trying to access protected route without auth
  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL(AUTH_PATH, request.url));
  }

  // Redirect to admin if already logged in and accessing auth routes
  if (isAuthenticated && pathname === AUTH_PATH) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

// Configure matcher to exclude static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
