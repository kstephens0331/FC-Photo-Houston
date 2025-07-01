import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { supabase } from "../../utils/supabaseClient";

export default function AdminSidebar() {
  const location = useLocation();
  const [hasPendingQuotes, setHasPendingQuotes] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("id")
        .eq("status", "pending")
        .limit(1);

      if (!error && data.length > 0) setHasPendingQuotes(true);
    };

    fetchPending();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/client-login";
  };

  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/customers", label: "Customers" },
    { to: "/admin/sessions", label: "Sessions" },
    { to: "/admin/quotes", label: "Submitted Quotes", showDot: true },
  ];

  return (
    <div className="w-64 bg-black text-white p-6 space-y-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center justify-between px-4 py-2 rounded hover:bg-white hover:text-black transition ${
              location.pathname.startsWith(link.to)
                ? "bg-white text-black font-semibold"
                : "text-white"
            }`}
          >
            <span>{link.label}</span>
            {link.showDot && hasPendingQuotes && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </Link>
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
