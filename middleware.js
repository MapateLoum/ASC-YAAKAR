import { NextResponse } from "next/server";
import { verifyTokenEdge, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/dashboard")) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const valid = token ? await verifyTokenEdge(token) : false;

    if (!valid) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
