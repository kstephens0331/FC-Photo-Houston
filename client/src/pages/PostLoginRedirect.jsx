import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const PostLoginRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession();

      if (error) {
        console.error("OAuth exchange failed:", error.message);
        return navigate("/client-login");
      }

      // Wait for session to fully initialize before continuing
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Session not established:", sessionError);
        return navigate("/client-login");
      }

      // Now safe to redirect
      navigate("/dashboard");
    };

    handleOAuth();
  }, [navigate]);

  return (
    <div className="p-6 text-center text-lg">
      Finalizing login…
    </div>
  );
};

export default PostLoginRedirect;
