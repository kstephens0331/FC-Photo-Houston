import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function AdminSessionDetails() {
  const { sessionId } = useParams();

  const [photos, setPhotos] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSessionData = async () => {
      const [{ data: photoData, error: photoErr }, { data: sessionData }] =
        await Promise.all([
          supabase
            .from("photos")
            .select("*")
            .eq("session_id", sessionId)
            .order("created_at", { ascending: true }),
          supabase
            .from("sessions")
            .select("session_name")
            .eq("id", sessionId)
            .single(),
        ]);

      if (photoErr) {
        console.error("Error loading photos:", photoErr.message);
        setError("Failed to load session.");
      } else {
        setPhotos(photoData);
        setSessionName(sessionData?.session_name || "Unnamed Session");
      }

      setLoading(false);
    };

    loadSessionData();
  }, [sessionId]);

  const handleDelete = async (photoId) => {
    const { error } = await supabase.from("photos").delete().eq("id", photoId);
    if (!error) {
      setPhotos(photos.filter((p) => p.id !== photoId));
    }
  };

  if (loading) return <div className="p-6">Loading session...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Session: {sessionName}</h1>
      {photos.length === 0 ? (
        <p>No photos in this session.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative">
              <img
                src={photo.image_url}
                alt="Uploaded"
                className="w-full h-auto rounded shadow"
              />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
