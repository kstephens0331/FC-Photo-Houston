import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const checkRedirect = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return navigate("/client-login");
    }

    const { data: customer, error } = await supabase
      .from("customers")
      .select("is_admin, profile_complete")
      .eq("user_id", user.id)
      .single();

    if (error || !customer) {
      return navigate("/client-login");
    }

    // ✅ Redirect admins to admin dashboard — but not from admin page itself
    if (customer.is_admin && !window.location.pathname.startsWith("/admin")) {
      return navigate("/admin/dashboard");
    }

    setLoading(false);
  };

  checkRedirect();
}, [navigate]);

  if (loading) return <div className="p-6">Loading customers...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    setError("Failed to load customers");
    console.error(error);
  } else {
    setCustomers(data);
  }
};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Directory</h1>
      <table className="min-w-full text-left border">
        <thead className="bg-gray-100 text-sm uppercase">
          <tr>
            <th className="px-4 py-2 border">Customer ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Created</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-2">{c.customer_id}</td>
              <td className="px-4 py-2">{c.name || "—"}</td>
              <td className="px-4 py-2">{c.email}</td>
              <td className="px-4 py-2">{c.phone || "—"}</td>
              <td className="px-4 py-2">
                {new Date(c.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => navigate(`/admin/customer/${c.id}/edit`)}
                  className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
                >
                  Manage
                </button>
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
