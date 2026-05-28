import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/market"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/market/:path*"],
};
