import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const CustomerRegistration = () => {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });

    if (signInError) {
      setError("Google sign-in failed.");
      setLoading(false);
    } else {
      localStorage.setItem("pendingProfile", JSON.stringify(form));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Your Account</h2>
      <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded mb-3" />
      <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded mb-3" />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border p-2 rounded mb-4" />

      <button onClick={handleGoogleRegister} disabled={loading} className="w-full bg-black text-white py-3 rounded hover:bg-gray-800">
        {loading ? "Redirecting..." : "Register with Google"}
      </button>
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default CustomerRegistration;
