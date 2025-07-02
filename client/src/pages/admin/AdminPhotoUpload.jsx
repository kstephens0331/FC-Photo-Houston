import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function AdminPhotoUpload() {
  const [customers, setCustomers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("customers")
      .select("id, name, email")
      .order("created_at", { ascending: false })
      .then(({ data }) => setCustomers(data || []));
  }, []);

  useEffect(() => {
    if (!selectedCustomerId) return;
    supabase
      .from("sessions")
      .select("id, session_name")
      .eq("customer_id", selectedCustomerId)
      .order("session_date", { ascending: false })
      .then(({ data }) => setSessions(data || []));
  }, [selectedCustomerId]);

  const handleUpload = async () => {
    setUploading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    if (!selectedCustomerId || !selectedSessionId || files.length === 0) {
      setError("Please select customer, session, and files.");
      setUploading(false);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;
    if (!token) {
      setError("Auth session missing.");
      setUploading(false);
      return;
    }

    let uploadedCount = 0;

    for (const file of files) {
      const filePath = `${selectedCustomerId}/${selectedSessionId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      const response = await fetch(
        "https://atipokknjidtpidpkeej.functions.supabase.co/upload-session-photos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer_id: selectedCustomerId,
            session_id: selectedSessionId,
            file_url: publicUrlData?.publicUrl,
          }),
        }
      );

      if (!response.ok) {
        console.error("❌ Edge upload failed:", await response.text());
        continue;
      }

      uploadedCount++;
      setProgress(Math.round((uploadedCount / files.length) * 100));
    }

    setSuccess("All files uploaded!");
    setUploading(false);
    setFiles([]);
    setProgress(100);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Photo Upload</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <label className="block font-medium mb-1">Customer</label>
      <select
        value={selectedCustomerId}
        onChange={(e) => {
          setSelectedCustomerId(e.target.value);
          setSelectedSessionId("");
        }}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">-- Select Customer --</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name || c.email}
          </option>
        ))}
      </select>

      <label className="block font-medium mb-1">Session</label>
      <select
        value={selectedSessionId}
        onChange={(e) => setSelectedSessionId(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        disabled={!selectedCustomerId}
      >
        <option value="">-- Select Session --</option>
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.session_name}
          </option>
        ))}
      </select>

      <label className="block font-medium mb-2">Upload Files</label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-400 p-6 mb-4 text-center rounded cursor-pointer bg-gray-50"
        onClick={() => fileInputRef.current.click()}
      >
        <p className="text-gray-600">Drag & drop files here or click to browse</p>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
        />
      </div>

      {files.length > 0 && (
        <div className="mb-4 text-sm text-gray-700">
          {files.length} file(s) selected
        </div>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded h-4 mb-4 overflow-hidden">
          <div
            className="bg-black h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
