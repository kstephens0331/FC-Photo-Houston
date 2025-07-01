import { Link, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";

export default function Sidebar({ isAdmin = false }) {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/client-login";
  };

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/dashboard/gallery", label: "Gallery" },
  { to: "/dashboard/settings", label: "Settings" },
  { to: "/dashboard/quotes", label: "Submit Quote" },
];

  return (
    <div className="w-64 bg-black text-white p-6 space-y-4">
      <h2 className="text-xl font-bold mb-6">
        {isAdmin ? "Admin Panel" : "Client Portal"}
      </h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            label={link.label}
            current={location.pathname === link.to}
          />
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 mt-10 bg-red-600 text-white rounded hover:bg-red-700"
      >
        <FiLogOut />
        Logout
      </button>
    </div>
  );
}

function SidebarLink({ to, label, current }) {
  return (
    <Link
      to={to}
      className={`block px-4 py-2 rounded hover:bg-white hover:text-black transition ${
        current ? "bg-white text-black font-semibold" : "text-white"
      }`}
    >
      {label}
    </Link>
  );
}
