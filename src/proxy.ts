import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/slides", "/api/chat"];

const authRoutes = ["/signin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth_token")?.value;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtectedRoute && !authToken) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL("/ask", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/slides/:path*", "/api/chat/:path*", "/signin"],
};
