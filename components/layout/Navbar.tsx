"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function NavbarAuth() {
  const { status } = useSession();

  return (
    <div className="flex justify-end items-center p-4 border-b bg-white">
      {status === "loading" && (
        <span className="text-sm text-gray-400">
          Checking session...
        </span>
      )}

      {status === "authenticated" && (
        <button
          onClick={() =>
            signOut({
              callbackUrl: "/dashboard",
            })
          }
          className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
        >
          Logout
        </button>
      )}

      {status === "unauthenticated" && (
        <button
          onClick={() =>
            signIn(undefined, {
              callbackUrl: "/dashboard",
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
        >
          Login
        </button>
      )}
    </div>
  );
}
