import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/dashboard",
  "/table",
  "/login",
];

const PROTECTED_PATHS = [
  "/input",
  "/category",
  "/audit",
  "/users",
  "/change-password",
];

// ⚠️ API custom kita SAJA
const CUSTOM_API_PATHS = [
  "/api/auth/change-password",
  "/api/users",
  "/api/actual",
  "/api/import-",
  "/api/split",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  /**
   * ===============================
   * 🚨 PENTING
   * JANGAN SENTUH NEXT-AUTH INTERNAL API
   * ===============================
   */
  if (pathname.startsWith("/api/auth") &&
      !pathname.startsWith("/api/auth/change-password")
  ) {
    return NextResponse.next();
  }

  /**
   * ===============================
   * CUSTOM API (JSON ONLY)
   * ===============================
   */
  if (CUSTOM_API_PATHS.some(p => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!token.active) {
      return NextResponse.json(
        { error: "User disabled" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  /**
   * ===============================
   * FORCE PASSWORD CHANGE (UI ONLY)
   * ===============================
   */
  if (
    token?.forcePasswordChange &&
    pathname !== "/change-password"
  ) {
    return NextResponse.redirect(
      new URL("/change-password", req.url)
    );
  }

  /**
   * ===============================
   * PUBLIC UI
   * ===============================
   */
  if (
    PUBLIC_PATHS.some(
      p => pathname === p || pathname.startsWith(`${p}/`)
    )
  ) {
    return NextResponse.next();
  }

  /**
   * ===============================
   * PROTECTED UI
   * ===============================
   */
  if (
    PROTECTED_PATHS.some(
      p => pathname === p || pathname.startsWith(`${p}/`)
    )
  ) {
    if (!token || !token.active) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
