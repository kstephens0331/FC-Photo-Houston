import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

const CustomerProfileDialog = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setPhone(user.phone || "");
      }
    });
  }, []);

  const handleSubmit = async () => {
    const { data: existing, error: lookupError } = await supabase
  .from("customers")
  .select("id")
  .eq("user_id", userId)
  .maybeSingle();

if (lookupError) {
  console.error("Lookup failed:", lookupError.message);
  return alert("Could not verify your profile. Try again.");
}

if (!existing) {
  const customer_id = `CUST-${Math.floor(100000 + Math.random() * 900000)}`;

  const { error: insertError } = await supabase.from("customers").insert([
    {
      user_id: userId,
      customer_id,
      name,
      phone,
      address,
      profile_complete: true,
    },
  ]);

  if (insertError) {
    console.error("Insert failed:", insertError.message);
    return alert("Failed to save your profile.");
  }
}

onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          onClick={handleSubmit}
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
};

export default CustomerProfileDialog;
