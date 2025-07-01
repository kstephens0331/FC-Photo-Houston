import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { Link, useLocation } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

 const verifyAdmin = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("No user session found.");
      return navigate("/client-login");
    }

    const { data: customer, error } = await supabase
      .from("customers")
      .select("is_admin")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !customer?.is_admin) {
      console.error("Not an admin or error occurred:", error?.message);
      return navigate("/client-login");
    }

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
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
