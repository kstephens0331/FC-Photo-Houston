import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { supabase } from "../../utils/supabaseClient";


const DashboardLayout = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  console.log("🧭 DashboardLayout loaded");

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout failed:", error.message);
  } else {
    window.location.href = "/"; // Redirect to homepage after logout
  }
};

  useEffect(() => {
    const verifyAccess = async () => {
      console.log("🔁 Loading dashboard layout...");

      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.warn("❌ No active session");
        return navigate("/client-login");
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Failed to fetch user:", userError?.message);
        return navigate("/client-login");
      }

      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("is_admin, profile_complete")
        .eq("user_id", user.id)
        .maybeSingle();

      if (customerError || !customer) {
        console.error("❌ Customer record not found:", customerError?.message);
        return navigate("/client-login");
      }

      console.log("✅ user:", user);
      console.log("✅ customer:", customer);

      if (customer.is_admin) {
        return navigate("/admin/dashboard");
      }

      // Optionally redirect to complete registration
      // if (!customer.profile_complete) {
      //   return navigate("/register-complete");
      // }

      setLoading(false);
    };

    verifyAccess();
  }, [navigate]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  

  return (
    <div className="min-h-screen flex bg-white text-black">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out bg-black text-white w-64 md:static md:translate-x-0`}
      >
        <div className="p-4 text-xl font-bold border-b border-white">
          FC Photo Houston
        </div>
        <nav className="flex flex-col gap-4 p-4 text-sm">
          <Link to="/dashboard/gallery" className="hover:text-beige">
            My Gallery
          </Link>
          <Link to="/dashboard/favorites" className="hover:text-beige">
            Favorites
          </Link>
          <Link to="/dashboard/quotes" className="hover:text-beige">
            Quotes
          </Link>
          <Link to="/dashboard/settings" className="hover:text-beige">
            Account Settings
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b shadow-sm bg-white sticky top-0 z-30">
          <button
            className="md:hidden text-black"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-lg font-semibold">Customer Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-black hover:text-red-500"
          >
            <FiLogOut size={20} />
          </button>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-[#f9f8f6] flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
