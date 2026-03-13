import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshSessionInMiddleware } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/library", "/asset", "/account"];
const AUTH_PATHS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const { user } = await refreshSessionInMiddleware(request, response);

  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtected && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const isAuthPage = AUTH_PATHS.some((p) => pathname === p);
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/library", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
