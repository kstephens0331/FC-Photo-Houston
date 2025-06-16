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

      // Step 1: Try to exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession();
      if (error) {
        console.error("OAuth exchange failed:", error.message);
        return navigate("/client-login");
      }

      // Step 2: Get the new session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Session not found after exchange.");
        return navigate("/client-login");
      }

      // ✅ Step 3: Session exists — now clean up the URL and redirect
      window.history.replaceState({}, document.title, "/dashboard");
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
