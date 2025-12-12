"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiMenu,
  FiHome,
  FiTable,
  FiPlusCircle,
  FiClipboard,
  FiFolder,
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", icon: <FiHome />, href: "/dashboard" },
  { name: "Input", icon: <FiPlusCircle />, href: "/input" },

  // ➜ Category Management
  { name: "Category", icon: <FiFolder />, href: "/category" },

  { name: "Table", icon: <FiTable />, href: "/table" },
  { name: "Audit Log", icon: <FiClipboard />, href: "/audit" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`h-screen bg-gray-900 text-white transition-all duration-300 
      ${open ? "w-64" : "w-16"} sticky top-0 left-0 flex flex-col`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4">
        {open && <span className="font-bold text-lg">IT Budgeting</span>}

        <button onClick={() => setOpen(!open)} className="text-xl">
          <FiMenu />
        </button>
      </div>

      {/* MENU */}
      <nav className="mt-4 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-all"
          >
            <span className="text-xl">{item.icon}</span>
            {open && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
