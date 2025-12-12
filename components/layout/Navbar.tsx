"use client";

import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <div className="w-full h-14 bg-white dark:bg-gray-800 shadow flex items-center justify-end px-6">
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
