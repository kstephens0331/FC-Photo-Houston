import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const CustomerSettings = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('customers')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };
    load();
  }, []);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const { id, account_number, created_at, ...editableData } = profile;
    await supabase.from('customers').update(editableData).eq('id', profile.id);
    alert('Profile updated!');
  };

  if (!profile) return <div>Loading...</div>;

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
        Account #: <strong>{profile.account_number}</strong>
      </p>
      <button
        onClick={handleSave}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Save Changes
      </button>
    </div>
  );
};

export default CustomerSettings;
