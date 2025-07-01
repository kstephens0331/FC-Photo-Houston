import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function AdminPhotoUpload() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preCustomerId = queryParams.get("customer_id");
  const preSessionId = queryParams.get("session_id");

  const [customers, setCustomers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(preCustomerId || "");
  const [selectedSessionId, setSelectedSessionId] = useState(preSessionId || "");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id, name, email")
        .order("created_at", { ascending: false });

      if (!error) setCustomers(data);
    };

    loadCustomers();
  }, []);

  useEffect(() => {
    const loadSessions = async () => {
      if (!selectedCustomerId) return;

      const { data, error } = await supabase
        .from("sessions")
        .select("id, session_name")
        .eq("customer_id", selectedCustomerId)
        .order("session_date", { ascending: false });

      if (!error) setSessions(data);
    };

    loadSessions();
  }, [selectedCustomerId]);

  const handleUpload = async () => {
    setUploading(true);
    setError(null);
    setSuccess(null);

    if (!selectedCustomerId || !selectedSessionId || files.length === 0) {
      setError("Please select customer, session, and choose images.");
      setUploading(false);
      return;
    }

    for (const file of files) {
      const filePath = `${selectedCustomerId}/${selectedSessionId}/${Date.now()}-${file.name}`;

      const { data: storageData, error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        setError("Upload failed.");
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) {
        setError("Failed to get public URL.");
        setUploading(false);
        return;
      }

      // ✅ Insert into photos table using correct column names
      const { error: insertError } = await supabase.from("customer_photos").insert({
  user_id: selectedCustomerId,
  file_url: publicUrl,
  session_id: selectedSessionId,
  is_approved: false,
  uploaded_at: new Date().toISOString()
});

      if (insertError) {
        console.error("Error saving photo records:", insertError.message);
        setError("Failed to save photo records.");
        setUploading(false);
        return;
      }
    }

    setSuccess("Photos uploaded successfully!");
    setFiles([]);
    setUploading(false);
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Upload Photos to Session</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <label className="block mb-2 font-medium">Select Customer</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedCustomerId}
        onChange={(e) => {
          setSelectedCustomerId(e.target.value);
          setSelectedSessionId("");
        }}
      >
        <option value="">-- Choose a customer --</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name || c.email}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Select Session</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedSessionId}
        onChange={(e) => setSelectedSessionId(e.target.value)}
        disabled={!selectedCustomerId}
      >
        <option value="">-- Choose a session --</option>
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.session_name}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Upload Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setFiles([...e.target.files])}
      />

      <button
        onClick={handleUpload}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Photos"}
      </button>
    </div>
  );
}
