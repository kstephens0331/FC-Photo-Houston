import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

const QuoteRequestForm = () => {
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccess(false);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setErrorMsg("You must be logged in.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        "https://atipokknjidtpidpkeej.functions.supabase.co/submit-quote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ type, notes }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setType("");
      setNotes("");
    } catch (err) {
      setErrorMsg("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Request a Quote</h2>

      <label className="block mb-2 font-medium">Request Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        required
      >
        <option value="">-- Select --</option>
        <option value="print">Prints</option>
        <option value="photo-book">Photo Book</option>
        <option value="keepsake">Keepsake Item</option>
        <option value="other">Other</option>
      </select>

      <label className="block mb-2 font-medium">Notes / Details</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any special instructions or preferences?"
        className="w-full border p-2 rounded mb-4"
        rows="4"
      />

      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Quote Request"}
      </button>

      {success && <p className="text-green-600 mt-4">Quote request submitted!</p>}
      {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}
    </form>
  );
};

export default QuoteRequestForm;
