import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function CustomerGallery() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGallery = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) return navigate("/client-login");
      const user = session.user;

      const { data: customer, error: custErr } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (custErr || !customer) return navigate("/register-complete");

      const [{ data: sessionList }, { data: photoList }] = await Promise.all([
        supabase
          .from("sessions")
          .select("id, session_name, session_date")
          .eq("customer_id", customer.id)
          .order("session_date", { ascending: false }),

        supabase
          .from("customer_photos")
          .select("*")
          .eq("user_id", customer.id)
          .eq("is_approved", true)
          .order("uploaded_at", { ascending: true }),
      ]);

      setUser(customer);
      setSessions(sessionList || []);
      setPhotos(photoList || []);
      setLoading(false);
    };

    fetchGallery();
  }, [navigate]);

  const toggleFavorite = async (photoId, currentValue) => {
    const { error } = await supabase
      .from("customer_photos")
      .update({ is_favorite: !currentValue })
      .eq("id", photoId);

    if (!error) {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId ? { ...p, is_favorite: !currentValue } : p
        )
      );
    } else {
      console.error("Failed to toggle favorite:", error.message);
    }
  };

  if (loading) return <div className="p-6">Loading gallery...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Photo Gallery</h1>

      {sessions.map((session) => {
        const sessionPhotos = photos.filter(
          (photo) => photo.session_id === session.id
        );

        if (sessionPhotos.length === 0) return null;

        return (
          <div key={session.id} className="mb-10">
            <h2 className="text-xl font-semibold mb-2">
              {session.session_name} —{" "}
              {new Date(session.session_date).toLocaleDateString()}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sessionPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group rounded overflow-hidden shadow bg-white p-2"
                >
                  <img
                    src={photo.file_url}
                    alt="Session"
                    className="w-full h-auto select-none rounded"
                    draggable={false}
                  />

                  <button
                    className="absolute top-2 right-2 text-yellow-400 text-xl"
                    onClick={() =>
                      toggleFavorite(photo.id, photo.is_favorite)
                    }
                  >
                    {photo.is_favorite ? <FaStar /> : <FaRegStar />}
                  </button>

                  {photo.downloadable && (
    <a
      href={photo.file_url}
      download
      className="absolute bottom-2 right-2 text-xs bg-white px-2 py-1 rounded shadow text-gray-700 hover:underline"
    >
      Download
    </a>
  )}

                  <textarea
                    defaultValue={photo.note || ""}
                    placeholder="Add a note (optional)..."
                    className="w-full mt-2 p-2 text-sm border rounded resize-none"
                    onBlur={async (e) => {
                      const newNote = e.target.value.trim();
                      if (newNote !== (photo.note || "")) {
                        const { error } = await supabase
                          .from("customer_photos")
                          .update({ note: newNote })
                          .eq("id", photo.id);

                        if (error) {
                          console.error("Failed to save note:", error.message);
                        } else {
                          setPhotos((prev) =>
                            prev.map((p) =>
                              p.id === photo.id ? { ...p, note: newNote } : p
                            )
                          );
                        }
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
