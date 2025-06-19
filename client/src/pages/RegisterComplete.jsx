import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const RegisterComplete = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Not logged in");
        return navigate("/login");
      }

      // Check if customer already exists
      const { data: existing } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        navigate("/dashboard");
        return;
      }

      // Try to load pending profile from localStorage (Google flow)
      const pending = localStorage.getItem("pendingProfile");
      if (pending) {
        try {
          const parsed = JSON.parse(pending);
          setName(parsed.name || "");
          setPhone(parsed.phone || "");
          setAddress(parsed.address || "");
        } catch {
          console.warn("Corrupted pending profile.");
        }
      }

      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return navigate("/login");

    const { error } = await supabase.from("customers").insert([
      {
        user_id: user.id,
        name,
        phone,
        email,
        address,
        is_admin: false,
        profile_complete: true,
      },
    ]);

    if (error) {
      console.error("Insert failed:", error.message);
      alert("There was a problem saving your profile.");
      setLoading(false);
      return;
    }

    localStorage.removeItem("pendingProfile");
    navigate("/dashboard");
  };

  if (loading) return <div className="p-10 text-center text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-gray-100 p-8 rounded-xl shadow-md border border-gray-300"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Complete Your Registration
        </h2>

        <label className="block mb-2 text-sm font-medium">Full Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 mb-4"
        />

        <label className="block mb-2 text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 mb-4"
        />

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 mb-4"
        />

        <label className="block mb-2 text-sm font-medium">Address</label>
        <input
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 mb-6"
        />

        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Finish Registration
        </button>
      </form>
    </div>
  );
};

export default RegisterComplete;
