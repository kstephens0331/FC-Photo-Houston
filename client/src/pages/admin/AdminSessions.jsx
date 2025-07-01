import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/");

      const { data: adminCheck } = await supabase
        .from("customers")
        .select("is_admin")
        .eq("user_id", user.id)
        .single();

      if (!adminCheck?.is_admin) return navigate("/");

      const { data, error } = await supabase
        .from("sessions")
        .select("id, user_id, created_at, customers(name)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load sessions:", error.message);
        return;
      }

      // Load photo counts per session
      const photoCounts = {};
      const { data: photoData } = await supabase
        .from("customer_photos")
        .select("sessionid");

photoData?.forEach((p) => {
  if (!photoCounts[p.sessionid]) photoCounts[p.sessionid] = 0;
  photoCounts[p.sessionid]++;
});

      const combined = data.map((s) => ({
        ...s,
        photoCount: photoCounts[s.id] || 0,
        customerName: s.customers?.name || "Unknown",
      }));

      setSessions(combined);
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  if (loading) return <div className="p-4">Loading sessions...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Photo Sessions</h1>
      <table className="min-w-full text-left border">
        <thead className="bg-gray-100 text-sm uppercase">
          <tr>
            <th className="px-4 py-2 border">Session ID</th>
            <th className="px-4 py-2 border">Customer</th>
            <th className="px-4 py-2 border">Created</th>
            <th className="px-4 py-2 border">Photos</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} className="border-t">
              <td className="px-4 py-2 font-mono">{session.session_label || session.id}</td>
              <td className="px-4 py-2">{session.customerName}</td>
              <td className="px-4 py-2">{new Date(session.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-2">{session.photoCount}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => navigate(`/admin/session/${session.id}`)}
                  className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
                >
                  View Session
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
