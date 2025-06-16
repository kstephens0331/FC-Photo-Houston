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

      // Step 1: Exchange the OAuth code for a session
      const { error } = await supabase.auth.exchangeCodeForSession();

      if (error) {
        console.error("OAuth exchange failed:", error.message);
        return navigate("/client-login");
      }

      // Step 2: Verify session was created
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error("No session found after token exchange");
        return navigate("/client-login");
      }

      // ✅ Step 3: Clean up URL (remove ?code, ?scope, etc.) only after session is saved
      window.history.replaceState({}, document.title, "/dashboard");

      // Optional: navigate instead of replaceState if you prefer:
      // navigate("/dashboard", { replace: true });
    };

    finalizeLogin();
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center h-screen px-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Logging you in...</h1>
        <p className="text-gray-600">Please wait while we finalize your session.</p>
      </div>
    </div>
  );
};

export default PostLoginRedirect;
