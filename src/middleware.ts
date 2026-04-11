import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Cookie name for JWT or session token (align with backend). */
const ACCESS_COOKIE = "accessToken";
/** Until JWT claims are decoded in middleware, role is read from this cookie. */
const ROLE_COOKIE = "userRole";
const ADMIN_ROLE = "admin";

const ADMIN_PATH_PREFIXES = [
  "/dashboard",
  "/kullanicilar",
  "/uzman-onay",
  "/uzmanlar",
  "/icerik",
  "/formlar",
  "/ayarlar",
] as const;

function isAdminRoute(pathname: string): boolean {
  return ADMIN_PATH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isAuthenticatedAdmin(request: NextRequest): boolean {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  if (!token) return false;
  // TODO: Verify JWT signature and claims.role === ADMIN when backend contract is fixed.
  return role === ADMIN_ROLE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const giris = pathname.startsWith("/giris");
  const admin = isAuthenticatedAdmin(request);

  if (pathname === "/") {
    if (admin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/giris", request.url));
  }

  if (giris) {
    if (admin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isAdminRoute(pathname)) {
    if (!admin) {
      return NextResponse.redirect(new URL("/giris", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
