// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;

      // allow login page
      if (pathname.startsWith("/login")) return true;

      // block if not logged in
      if (!token) return false;

      // viewer cannot access input
      if (pathname.startsWith("/input") && token.role !== "ADMIN") {
        return false;
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/input/:path*", "/table/:path*", "/audit/:path*"],
};

