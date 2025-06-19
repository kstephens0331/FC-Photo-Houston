import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setLoading(false);
        setShowLogin(true); // no session → show login
        return;
      }

      const { data: customer, error } = await supabase
        .from("customers")
        .select("is_admin")
        .eq("user_id", user.id)
        .single();

      if (error || !customer) {
        console.warn("⚠️ No customer record found — staying on login page.");
        setShowLogin(true); // allow Google login again
        setLoading(false);
        return;
      }

      // ✅ Valid customer
      if (customer.is_admin) {
        return navigate("/admin/dashboard");
      }

      return navigate("/dashboard");
    };

    checkSession();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/client-login",
      },
    });

    if (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Checking session...</div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow bg-white text-center">
      <h2 className="text-2xl font-bold mb-6">Login to FC Photo Houston</h2>

      {showLogin && (
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 border border-black text-black rounded-lg hover:bg-gray-100 transition"
        >
          Sign in with Google
        </button>
      )}

      {!showLogin && (
        <div className="text-red-600 text-sm">
          We're unable to log you in. Please try again or contact support.
        </div>
      )}
    </div>
  );
}
