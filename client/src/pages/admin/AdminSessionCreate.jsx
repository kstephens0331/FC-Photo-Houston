import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function AdminSessionCreate() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedId = queryParams.get("customer_id");

  const [customers, setCustomers] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(preselectedId || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id, name, email")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load customers:", error.message);
      } else {
        setCustomers(data);
      }

      setLoading(false);
    };

    loadCustomers();
  }, []);

  const handleCreateSession = async () => {
    setSaving(true);
    setSuccess(null);
    setError(null);

    if (!selectedCustomerId || !sessionName || !sessionDate) {
      setError("Please fill out all required fields.");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from("sessions").insert([
      {
        customer_id: selectedCustomerId,
        session_name: sessionName,
        session_date: sessionDate,
        notes: notes,
      },
    ]);

    if (insertError) {
      console.error("Session creation failed:", insertError.message);
      setError("Failed to create session.");
      setSaving(false);
      return;
    }

    const { data: latestSession, error: fetchError } = await supabase
      .from("sessions")
      .select("id")
      .eq("customer_id", selectedCustomerId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!fetchError && latestSession) {
      navigate(
        `/admin/photo-upload?customer_id=${selectedCustomerId}&session_id=${latestSession.id}`
      );
    } else {
      setSuccess("Session created, but redirect failed.");
    }

    setSaving(false);
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Create New Photo Session</h1>

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {success && <div className="text-green-600 mb-4">{success}</div>}

          <label className="block mb-2 font-medium">Select Customer</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">-- Choose a customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.email}
              </option>
            ))}
          </select>

          <label className="block mb-2 font-medium">Session Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="e.g. Spring Minis"
          />

          <label className="block mb-2 font-medium">Session Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded mb-4"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />

          <label className="block mb-2 font-medium">Notes (optional)</label>
          <textarea
            className="w-full p-2 border rounded mb-4"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button
            onClick={handleCreateSession}
            disabled={saving}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            {saving ? "Creating..." : "Create Session"}
          </button>
        </>
      )}
    </div>
  );
}
