import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { FiLogOut } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const verifyAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate("/client-login");

    const { data: customer, error } = await supabase
      .from("customers")
      .select("is_admin")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !customer?.is_admin) return navigate("/client-login");

    setLoading(false);
  };

  useEffect(() => {
    verifyAdmin();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/client-login";
  };

  if (loading) return <div className="p-6">Loading admin dashboard...</div>;

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar (inline) */}
      <div className="w-64 bg-black text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <SidebarLink to="/admin/dashboard" label="Dashboard" current={location.pathname === "/admin/dashboard"} />
          <SidebarLink to="/admin/customers" label="Customers" current={location.pathname.startsWith("/admin/customers")} />
          <SidebarLink to="/admin/sessions" label="Sessions" current={location.pathname.startsWith("/admin/sessions")} />
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 mt-10 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <FiLogOut />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
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
