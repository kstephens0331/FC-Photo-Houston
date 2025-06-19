import { useEffect, useState } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    const verifyAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return navigate("/client-login");

      const { data: user } = await supabase.auth.getUser();
      const { data: customer, error } = await supabase
        .from("customers")
        .select("is_admin")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !customer?.is_admin) return navigate("/client-login");

      setLoading(false);
    };

    verifyAdmin();
  }, [navigate]);

  if (loading) return <div className="p-6">Checking admin access...</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-5 flex flex-col space-y-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/admin/sessions" className="hover:underline">Sessions</Link>
        <Link to="/admin/customers" className="hover:underline">Customers</Link>
        <button
          onClick={handleLogout}
          className="mt-auto bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">
        <Outlet />
      </main>
    </div>
  );
}
