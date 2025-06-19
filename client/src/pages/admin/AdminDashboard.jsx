import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/client-login");

      const { data: customer, error } = await supabase
        .from("customers")
        .select("is_admin")
        .eq("user_id", user.id)
        .single();

      if (error || !customer) return navigate("/client-login");

      if (customer.is_admin && !window.location.pathname.startsWith("/admin")) {
        return navigate("/admin/dashboard");
      }

      await fetchCustomers();
      setLoading(false);
    };

    checkRedirect();
  }, [navigate]);

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
      setFiltered(data);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);

    const filteredResults = customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term)
    );

    setFiltered(filteredResults);
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const createCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      alert("Name and email are required.");
      return;
    }

    setCreating(true);

    const { error } = await supabase.from("customers").insert([
      {
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        is_admin: false,
        profile_complete: true,
      },
    ]);

    if (error) {
      alert("Failed to create customer.");
      console.error(error);
    } else {
      setNewCustomer({ name: "", email: "", phone: "" });
      setShowForm(false);
      await fetchCustomers();
    }

    setCreating(false);
  };

  if (loading) return <div className="p-6">Loading customers...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customer Directory</h1>
        <button
          onClick={toggleForm}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
        >
          {showForm ? "Cancel" : "+ New Customer"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded bg-white shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Create New Customer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              value={newCustomer.name}
              onChange={handleFormChange}
              placeholder="Full Name"
              className="p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              value={newCustomer.email}
              onChange={handleFormChange}
              placeholder="Email"
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              value={newCustomer.phone}
              onChange={handleFormChange}
              placeholder="Phone (optional)"
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={createCustomer}
            disabled={creating}
            className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {creating ? "Saving..." : "Save Customer"}
          </button>
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by name or email..."
        className="mb-4 p-2 border rounded w-full max-w-md"
      />

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
          {filtered.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-2">{c.customer_id || c.id}</td>
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
