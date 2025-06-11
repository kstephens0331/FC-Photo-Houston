import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function AdminCustomer() {
  const { id } = useParams(); // this is the Supabase `customers.id`
  const [customer, setCustomer] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");

  // Fetch customer info
  useEffect(() => {
    const fetchCustomer = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching customer:", error);
        return;
      }
      setCustomer(data);
    };

    fetchCustomer();
  }, [id]);

  // Upload logic
  const handleUpload = async () => {
    if (!files.length || !sessionId) {
      setStatus("Missing files or session ID.");
      return;
    }

    setStatus("Uploading...");
    for (const file of files) {
      const filePath = `${sessionId}/${uuidv4()}-${file.name}`;

      const { data, error: uploadError } = await supabase.storage
        .from("customer-photos")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setStatus("Upload failed.");
        return;
      }

      const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/customer-photos/${filePath}`;

      await supabase.from("customer_photos").insert({
        user_id: customer.user_id,
        sessionId: sessionId,
        file_url: url,
        uploaded_at: new Date(),
      });
    }

    setStatus("Upload complete!");
    setFiles([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Customer</h1>

      {customer ? (
        <div className="mb-6 space-y-1">
          <p><strong>Customer ID:</strong> {customer.customer_id}</p>
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
        </div>
      ) : (
        <p>Loading customer info...</p>
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-1">Session ID</label>
        <input
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="e.g., may2025-family-session"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Upload Photos</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="block"
        />
      </div>

      <button
        onClick={handleUpload}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Upload
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
