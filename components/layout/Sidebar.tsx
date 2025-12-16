"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiHome,
  FiTable,
  FiPlusCircle,
  FiClipboard,
  FiFolder,
} from "react-icons/fi";
import RoleGate from "@/components/auth/RoleGate";

/**
 * Menu config
 * - Jangan render berdasarkan role di sini
 * - Role filtering dilakukan via <RoleGate />
 */
const menuItems = [
  { name: "Dashboard", icon: FiHome, href: "/dashboard" },
  { name: "Table", icon: FiTable, href: "/table" },

  // ADMIN ONLY
  { name: "Input", icon: FiPlusCircle, href: "/input", adminOnly: true },
  { name: "Category", icon: FiFolder, href: "/category", adminOnly: true },
  { name: "Audit Log", icon: FiClipboard, href: "/audit", adminOnly: true },
];

export default function Sidebar() {
  const [open, setOpen] = useState<boolean>(true);
  const pathname = usePathname();

  return (
    <aside
      className={`h-screen bg-gray-900 text-white transition-all duration-300 
      ${open ? "w-64" : "w-16"} sticky top-0 left-0 flex flex-col`}
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {open && <span className="font-bold text-lg">IT Budgeting</span>}

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xl hover:text-gray-300"
          aria-label="Toggle sidebar"
        >
          <FiMenu />
        </button>
      </div>

      {/* ================= MENU ================= */}
      <nav className="mt-4 flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          const link = (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 mx-2 rounded-md transition-all
                ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
            >
              <span className="text-xl">
                <Icon />
              </span>
              {open && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          );

          // ADMIN ONLY MENU
          if (item.adminOnly) {
            return (
              <RoleGate key={item.name} allow={["ADMIN"]}>
                {link}
              </RoleGate>
            );
          }

          return link;
        })}
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="p-4 text-xs text-gray-500 border-t border-gray-800">
        {open && <span>© {new Date().getFullYear()} IT Budgeting</span>}
      </div>
    </aside>
  );
}
