import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const PostLoginRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const finalizeLogin = async () => {
      const hasAuthCode = location.search.includes("code=");
      if (!hasAuthCode) return navigate("/client-login");

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession();
      if (exchangeError) {
        console.error("OAuth exchange failed:", exchangeError.message);
        return navigate("/client-login");
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Failed to get user after OAuth.");
        return navigate("/client-login");
      }

      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!customer) {
        await supabase.from("customers").insert({
          user_id: user.id,
          email: user.email,
          is_admin: false,
          profile_complete: false,
        });
        return navigate("/register-complete");
      }

      if (customer.is_admin) {
        return navigate("/admin/dashboard");
      }

      return navigate("/dashboard");
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
