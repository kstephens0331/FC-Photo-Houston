import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function AdminCustomer() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadCustomer = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        console.error("Failed to load customer:", error?.message);
      } else {
        setCustomer(data);
        // Optionally auto-generate session ID:
        // const autoSession = `${data.name?.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
        // setSessionId(autoSession);
      }

      setLoading(false);
    };

    loadCustomer();
  }, [id]);

  const handleUpload = async () => {
    if (!customer?.id || !sessionId || files.length === 0) {
      alert("Missing session ID, files, or customer ID.");
      return;
    }

    setUploading(true);

    // Ensure session exists
    const { error: sessionErr } = await supabase
      .from("photo_sessions")
      .insert([{ session_id: sessionId, user_id: customer.id }])
      .select()
      .maybeSingle();

    if (sessionErr && !sessionErr.message.includes("duplicate")) {
      alert("Failed to create session.");
      console.error(sessionErr);
      setUploading(false);
      return;
    }

    for (let file of files) {
      const fileName = `${customer.id}/${sessionId}/${Date.now()}-${file.name}`;
      const { error: storageError } = await supabase.storage
        .from("customer-photos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (storageError) {
        console.error("Upload error:", storageError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("customer-photos")
        .getPublicUrl(fileName);

      await supabase.from("customer_photos").insert({
        user_id: customer.id,
        session_id: sessionId,
        file_url: publicUrl,
      });
    }

    setSuccess(true);
    setUploading(false);
    setFiles([]);
    setSessionId("");
  };

  if (loading) return <div className="p-6">Loading customer info...</div>;
  if (!customer) return <div className="p-6 text-red-600">Customer not found.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-2">Manage Customer</h1>
      <p className="text-sm text-gray-600 mb-6">
        Uploading for: <strong>{customer.name}</strong> ({customer.email})<br />
        Customer ID: <span className="font-mono">{customer.customer_id || customer.id}</span>
      </p>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Session ID</label>
        <input
          type="text"
          placeholder="e.g., may2025-family-session"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Upload Photos</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {success && (
        <p className="text-green-600 mt-4">Photos uploaded successfully!</p>
      )}
    </div>
  );
}
