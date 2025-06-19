import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function AdminCustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Customer not found.");
        console.error(error.message);
      } else {
        setCustomer(data);
      }
    };

    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("customer_id", id)
        .order("session_date", { ascending: false });

      if (data) setSessions(data);
    };

    fetchCustomer().then(() => setLoading(false));
    fetchSessions();
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    setSuccess(null);
    setError(null);

    const { error } = await supabase
      .from("customers")
      .update({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        profile_complete: customer.profile_complete,
      })
      .eq("id", id);

    if (error) {
      setError("Failed to save customer.");
      console.error(error.message);
    } else {
      setSuccess("Customer updated successfully!");
    }

    setSaving(false);
  };

  if (loading) return <div className="p-6">Loading customer...</div>;
  if (!customer) return <div className="p-6 text-red-600">Customer not found.</div>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Edit Customer Profile</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <label className="block mb-2 font-medium">Name</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        value={customer.name || ""}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
      />

      <label className="block mb-2 font-medium">Email</label>
      <input
        type="email"
        className="w-full p-2 border rounded mb-4"
        value={customer.email || ""}
        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
      />

      <label className="block mb-2 font-medium">Phone</label>
      <input
        type="tel"
        className="w-full p-2 border rounded mb-4"
        value={customer.phone || ""}
        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
      />

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          className="mr-2"
          checked={customer.profile_complete}
          onChange={(e) =>
            setCustomer({ ...customer, profile_complete: e.target.checked })
          }
        />
        Profile is complete
      </label>

      <button
        onClick={handleUpdate}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      <button
        onClick={() => navigate(`/admin/session/create?customer_id=${customer.id}`)}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mt-6 ml-4"
      >
        Create New Session
      </button>

      <h2 className="text-xl font-semibold mt-10 mb-2">Sessions</h2>
      {sessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li key={s.id} className="border p-4 rounded">
              <div className="font-medium">{s.session_name}</div>
              <div className="text-sm text-gray-600">
                {new Date(s.session_date).toLocaleDateString()}
              </div>
              <button
                onClick={() =>
                  navigate(
                    `/admin/photo-upload?customer_id=${customer.id}&session_id=${s.id}`
                  )
                }
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Upload Photos
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
