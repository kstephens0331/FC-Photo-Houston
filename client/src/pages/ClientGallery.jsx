import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CustomerGallery() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGallery = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        return navigate("/client-login");
      }

      setUser(session.user);

      const { data: customer, error: custErr } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (custErr || !customer) {
        return navigate("/client-login");
      }

      const [{ data: sessionList }, { data: photoList }] = await Promise.all([
        supabase
          .from("sessions")
          .select("id, session_name, session_date")
          .eq("customer_id", customer.id)
          .order("session_date", { ascending: false }),

        supabase
          .from("photos")
          .select("*")
          .eq("customer_id", customer.id)
          .eq("status", "approved")
          .order("created_at", { ascending: true }),
      ]);

      setSessions(sessionList || []);
      setPhotos(photoList || []);
      setLoading(false);
    };

    fetchGallery();
  }, [navigate]);

  if (loading) return <div className="p-6">Loading gallery...</div>;

  return (
    <div
      className="p-6"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        userSelect: "none",
        pointerEvents: "auto",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <h1 className="text-2xl font-bold mb-6">Your Photo Gallery</h1>

      {sessions.map((session) => {
        const sessionPhotos = photos.filter((p) => p.session_id === session.id);
        if (sessionPhotos.length === 0) return null;

        return (
          <div key={session.id} className="mb-10">
            <h2 className="text-xl font-semibold mb-2">
              {session.session_name} —{" "}
              {new Date(session.session_date).toLocaleDateString()}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sessionPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.image_url}
                    alt="Session"
                    className="w-full h-auto rounded shadow select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
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
