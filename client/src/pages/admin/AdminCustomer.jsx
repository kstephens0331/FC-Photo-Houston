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
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error("⚠️ No session found.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://atipokknjidtpidpkeej.functions.supabase.co/get-customer",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      console.log("🛰️ Response status:", res.status);

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Failed to fetch customer:", data.error);
        setCustomer(null);
        setLoading(false); // 🔥 FIXED
        return;
      }

      setCustomer(data);
      setLoading(false); // 🔥 FIXED
    } catch (err) {
      console.error("❌ Network error:", err);
      setCustomer(null);
      setLoading(false); // 🔥 FIXED
    }
  };

  loadCustomer();
}, [id]);

  const handleUpload = async () => {
    if (!customer?.id || !sessionId || files.length === 0) {
      alert("Missing session ID, files, or customer ID.");
      return;
    }

    setUploading(true);

    const { error: sessionErr } = await supabase
      .from("sessions")
      .insert([{ session_id: sessionId, user_id: customer.id }])
      .select()
      .maybeSingle();

    if (sessionErr) {
  const msg = sessionErr.message || "";
  if (!msg.includes("duplicate")) {
    alert("Failed to create session.");
    console.error(sessionErr);
    setUploading(false);
    return;
  }
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
