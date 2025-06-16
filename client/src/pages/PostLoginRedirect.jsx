import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const PostLoginRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const finalizeLogin = async () => {
      const hasAuthCode = location.search.includes("code=");

      if (!hasAuthCode) {
        console.warn("No auth code in URL — skipping token exchange");
        return navigate("/client-login");
      }

      // Attempt to exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession();

      if (error) {
        console.error("OAuth exchange failed:", error.message);
        return navigate("/client-login");
      }

      // ✅ Exchange succeeded – safe to clean up URL and redirect
      window.history.replaceState({}, document.title, "/dashboard");
    };

    finalizeLogin();
  }, [navigate, location]);

  return (
    <div className="p-6 text-center text-gray-700">
      <h1 className="text-2xl font-semibold mb-4">Logging you in...</h1>
      <p>Please wait while we finalize your session.</p>
    </div>
  );
};

export default PostLoginRedirect;
