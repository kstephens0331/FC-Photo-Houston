import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      } else {
        console.error("Profile fetch error:", error?.message);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!profile) return;

    setSaving(true);

    const { error } = await supabase
      .from("customers")
      .update({
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
      })
      .eq("user_id", profile.user_id);

    if (error) {
      alert("Failed to update profile.");
      console.error(error.message);
    } else {
      alert("Profile updated successfully.");
    }

    setSaving(false);
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!profile) return <p className="p-6 text-center text-red-600">No profile found.</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Account Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Customer ID</label>
          <input
            type="text"
            className="w-full border p-2 rounded bg-gray-100"
            value={profile.customer_id}
            disabled
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="tel"
            className="w-full border p-2 rounded"
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={profile.address || ""}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-800 transition"
        >
          {saving ? "Saving..." : "Update Settings"}
        </button>
      </div>
    </div>
  );
}
