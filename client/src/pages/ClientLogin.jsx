import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking, login, error

  // Check for existing session and redirect if valid
  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setStatus("login");
        return;
      }

      // Check customer record
      const { data: customer, error } = await supabase
        .from("customers")
        .select("is_admin")
        .eq("user_id", user.id)
        .single();

      if (error || !customer) {
        console.warn("⚠️ No matching customer record, signing out.");
        await supabase.auth.signOut();
        setStatus("login");
        return;
      }

      // Redirect based on role
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
        redirectTo: window.location.origin + "/client-login",
      },
    });

    if (error) {
      console.error("Google login failed:", error.message);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow bg-white text-center">
      <h2 className="text-2xl font-bold mb-6">Login to FC Photo Houston</h2>

      {status === "checking" && (
        <div className="text-gray-600">Checking session...</div>
      )}

      {status === "login" && (
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 border border-black text-black rounded-lg hover:bg-gray-100 transition"
        >
          Sign in with Google
        </button>
      )}

      {status === "error" && (
        <div className="text-red-600 mt-4">
          Something went wrong. Please try again later.
        </div>
      )}
    </div>
  );
}
