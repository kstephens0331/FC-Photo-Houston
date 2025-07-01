import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

const QuoteHistory = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const res = await fetch("https://atipokknjidtpidpkeej.functions.supabase.co/get-customer", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const customer = await res.json();
      if (!res.ok || !customer?.id) return;

      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("user_id", customer.id)
        .order("created_at", { ascending: false });

      if (!error) setQuotes(data);
      setLoading(false);
    };

    fetchQuotes();
  }, []);

  if (loading) return <p className="p-6">Loading quote history...</p>;
  if (quotes.length === 0) return <p className="p-6 text-gray-500">No quote requests yet.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Quote Requests</h2>
      <div className="space-y-4">
        {quotes.map((q) => (
          <div
            key={q.id}
            className="p-4 border rounded shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{q.type.replace("-", " ").toUpperCase()}</p>
              {q.notes && <p className="text-sm text-gray-600">{q.notes}</p>}
              <p className="text-xs text-gray-400 mt-1">
                Submitted: {new Date(q.created_at).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded ${
                q.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : q.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {q.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuoteHistory;
