import { useEffect, useState, useRef } from "react";
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
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

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

        const data = await res.json();
        if (!res.ok) {
          console.error("❌ Failed to fetch customer:", data.error);
          setCustomer(null);
        } else {
          setCustomer(data);
        }
      } catch (err) {
        console.error("❌ Network error:", err);
        setCustomer(null);
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
    setProgress(0);
    setSuccess(false);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    const { error: sessionErr } = await supabase
      .from("sessions")
      .insert([
        {
          user_id: customer.id,
          session_label: sessionId,
          session_name: sessionId,
          session_date: new Date().toISOString().split("T")[0],
          notes: "Uploaded via AdminCustomer.jsx",
        },
      ])
      .select()
      .maybeSingle();

    if (sessionErr && !sessionErr.message.includes("duplicate")) {
      alert("Failed to create session.");
      console.error(sessionErr);
      setUploading(false);
      return;
    }

    let completed = 0;
    for (const file of files) {
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

      const edgeRes = await fetch("https://atipokknjidtpidpkeej.functions.supabase.co/upload-session-photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          customer_id: customer.id,
          session_id: sessionId,
          file_url: publicUrl,
        }),
      });

      if (!edgeRes.ok) {
        console.error("❌ Edge function failed:", await edgeRes.text());
        setUploading(false);
        return;
      }

      completed++;
      setProgress(Math.round((completed / files.length) * 100));
    }

    setSuccess(true);
    setUploading(false);
    setFiles([]);
    setSessionId("");
    setProgress(100);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
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

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full h-40 border-2 border-dashed border-gray-400 rounded flex flex-col justify-center items-center mb-4 text-gray-600"
      >
        <p className="text-sm">Drag and drop photos here</p>
        <p className="text-xs mt-1">or click below to browse</p>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 px-4 py-1 bg-black text-white text-sm rounded hover:bg-gray-800"
        >
          Select Files
        </button>
      </div>

      {files.length > 0 && (
        <div className="mb-4 text-sm text-gray-700">
          {files.length} file{files.length > 1 ? "s" : ""} selected
        </div>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-black h-4 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {uploading ? `Uploading... ${progress}%` : "Upload"}
      </button>

      {success && (
        <p className="text-green-600 mt-4">Photos uploaded successfully!</p>
      )}
    </div>
  );
}
