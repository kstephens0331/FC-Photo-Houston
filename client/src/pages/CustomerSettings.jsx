import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const CustomerSettings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Failed to load customer profile:", error.message);
        } else {
          setProfile(data);
        }
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!profile) return;

    const { id, account_number, user_id, created_at, ...editableData } = profile;

    const { error } = await supabase
      .from('customers')
      .update(editableData)
      .eq('user_id', profile.user_id);

    if (error) {
      alert('Error updating profile: ' + error.message);
    } else {
      alert('Profile updated!');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading your profile...</div>;
  if (!profile) return <div className="p-6 text-center text-red-600">Profile not found.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

      {['first_name', 'last_name', 'phone_number', 'email', 'address'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block mb-1 capitalize">{field.replace('_', ' ')}</label>
          <input
            type="text"
            name={field}
            value={profile[field] || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
      ))}

      <p className="text-sm text-gray-500 mb-4">
        <span className="font-semibold">Account #:</span>{' '}
        <span className="font-mono">{profile.account_number}</span>
      </p>

      <button
        onClick={handleSave}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Save Changes
      </button>
    </div>
  );
};

export default CustomerSettings;
