import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuotes = async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*, profiles(name, email)")
        .order("created_at", { ascending: false });

      if (!error) setQuotes(data);
      setLoading(false);
    };

    loadQuotes();
  }, []);

  if (loading) return <p className="p-6">Loading quotes...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Submitted Quotes</h2>
      {quotes.length === 0 ? (
        <p>No quotes yet.</p>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div key={q.id} className="p-4 bg-white rounded shadow border">
              <p className="font-semibold">{q.type.toUpperCase()}</p>
              <p className="text-sm text-gray-500">
                From: {q.profiles?.name || "Unknown"} ({q.profiles?.email || "N/A"})
              </p>
              <p className="text-xs text-gray-400">
                Submitted: {new Date(q.created_at).toLocaleString()}
              </p>
              <p className="mt-2 text-sm">{q.notes}</p>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                {q.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;
