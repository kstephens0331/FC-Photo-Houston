import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Step 1: Sign in
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setErrorMsg("Login failed: " + signInError.message);
      return;
    }

    const userId = authData?.user?.id;

    if (!userId) {
      setErrorMsg("No user session found.");
      return;
    }

    // Step 2: Check if this user is an admin
    const { data: customer, error: roleError } = await supabase
      .from("customers")
      .select("is_admin")
      .eq("user_id", userId)
      .single();

    if (roleError || !customer?.is_admin) {
      setErrorMsg("Unauthorized: Admin access required.");
      await supabase.auth.signOut();
      return;
    }

    // Step 3: Redirect to admin dashboard
    navigate("/admin/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <input
          className="w-full px-4 py-2 border rounded"
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Login
        </button>
        {errorMsg && <p className="text-red-500 text-sm text-center mt-2">{errorMsg}</p>}
      </form>
    </div>
  );
}
