import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import Sidebar from "../Sidebar";
import { FiLogOut } from "react-icons/fi";

export default function DashboardLayout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/client-login";
  };

  useEffect(() => {
    const checkRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/client-login");

      const { data: customer, error } = await supabase
        .from("customers")
        .select("is_admin, profile_complete")
        .eq("user_id", user.id)
        .single();

      if (error || !customer) return navigate("/client-login");

      // ✅ Prevent loop: only redirect to admin if not already on /admin/*
      if (customer.is_admin && !window.location.pathname.startsWith("/admin")) {
        return navigate("/admin/dashboard");
      }

      setLoading(false);
    };

    checkRedirect();
  }, [navigate]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
