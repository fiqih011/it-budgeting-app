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
  FiUsers,
} from "react-icons/fi";
import { Role } from "@prisma/client";
import RoleGate from "@/components/auth/RoleGate";

type MenuItem = {
  name: string;
  icon: any;
  href: string;
  allow: Role[];
};

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: FiHome,
    href: "/dashboard",
    allow: ["VIEWER", "USER", "ADMIN"],
  },
  {
    name: "Table",
    icon: FiTable,
    href: "/table",
    allow: ["VIEWER", "USER", "ADMIN"],
  },
  {
    name: "Input",
    icon: FiPlusCircle,
    href: "/input",
    allow: ["USER", "ADMIN"],
  },
  {
    name: "Category",
    icon: FiFolder,
    href: "/category",
    allow: ["USER", "ADMIN"],
  },
  {
    name: "Users",
    icon: FiUsers,
    href: "/users",
    allow: ["ADMIN"],
  },
  {
    name: "Audit Log",
    icon: FiClipboard,
    href: "/audit",
    allow: ["ADMIN"],
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`h-screen bg-gray-900 text-white transition-all duration-300
      ${open ? "w-64" : "w-16"} sticky top-0 left-0 flex flex-col`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {open && <span className="font-bold text-lg">IT Budgeting</span>}
        <button onClick={() => setOpen(v => !v)}>
          <FiMenu />
        </button>
      </div>

      {/* MENU */}
      <nav className="mt-4 flex-1 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          const link = (
            <Link
              href={item.href}
              className={`flex items-center gap-3 p-3 mx-2 rounded-md
              ${isActive ? "bg-gray-800" : "hover:bg-gray-700"}`}
            >
              <Icon />
              {open && <span>{item.name}</span>}
            </Link>
          );

          return (
            <RoleGate key={item.name} allow={item.allow}>
              {link}
            </RoleGate>
          );
        })}
      </nav>
    </aside>
  );
}
