import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccessAndLoad = async () => {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        return navigate("/client-login");
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("User fetch failed:", userError?.message);
        return navigate("/client-login");
      }

      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("is_admin")
        .eq("user_id", user.id)
        .maybeSingle();

      if (customerError || !customer || !customer.is_admin) {
        console.warn("Access denied — not admin.");
        return navigate("/client-login");
      }

      const { data, error: customerListError } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (customerListError) {
        setError("Could not load customers.");
        console.error(customerListError.message);
      } else {
        setCustomers(data);
      }

      setLoading(false);
    };

    checkAdminAccessAndLoad();
  }, [navigate]);

  if (loading) return <div className="p-6">Loading admin dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
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
                  onClick={() => navigate(`/admin/customer/${c.id}`)}
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
