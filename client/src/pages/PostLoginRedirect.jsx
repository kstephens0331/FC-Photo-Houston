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

      const { error } = await supabase.auth.exchangeCodeForSession();

      if (error) {
        console.error("OAuth exchange failed:", error.message);
        return navigate("/client-login");
      }

      // Successful login
      navigate("/dashboard");
    };

    finalizeLogin();
  }, [navigate, location]);

  return (
    <div className="p-6 text-center">
      Finalizing login...
    </div>
  );
};

export default PostLoginRedirect;
