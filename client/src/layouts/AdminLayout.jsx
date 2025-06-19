import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import Sidebar from "../../components/admin/AdminSidebar";
import { FiLogOut } from "react-icons/fi";

export default function AdminLayout() {
  const navigate = useNavigate();
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
      <Sidebar />
      <div className="flex-1 p-6 bg-white">
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
