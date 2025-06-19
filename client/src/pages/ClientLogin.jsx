import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setLoading(false); // no user yet — show login button
        return;
      }

      const { data: customer, error } = await supabase
        .from("customers")
        .select("is_admin")
        .eq("user_id", user.id)
        .single();

      if (error || !customer) {
        console.error("Customer lookup failed:", error?.message);
        return;
      }

      if (customer.is_admin) {
        return navigate("/admin/dashboard");
      } else {
        return navigate("/dashboard");
      }
    };

    checkSession();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/client-login", // stay on same page
      },
    });

    if (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Checking session...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow bg-white text-center">
      <h2 className="text-2xl font-bold mb-6">Login to FC Photo Houston</h2>

      <button
        onClick={handleGoogleLogin}
        className="w-full py-3 border border-black text-black rounded-lg hover:bg-gray-100 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
}
