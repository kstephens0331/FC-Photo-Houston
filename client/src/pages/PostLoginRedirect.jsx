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

      // Exchange OAuth code
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession();
      if (exchangeError) {
        console.error("OAuth exchange failed:", exchangeError.message);
        return navigate("/client-login");
      }

      // Get session
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !user) {
        console.error("Session not found after exchange.");
        return navigate("/client-login");
      }

      // Check if customer exists
      const { data: existingCustomer, error: fetchError } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // If not, insert a record for this new user
      if (!existingCustomer) {
        const { error: insertError } = await supabase.from("customers").insert({
          user_id: user.id,
          email: user.email,
          is_admin: false,
          profile_complete: false,
        });

        if (insertError) {
          console.error("Error inserting customer record:", insertError.message);
          return navigate("/client-login");
        }
      }

      // Check if admin
      const { data: customerCheck } = await supabase
        .from("customers")
        .select("is_admin")
        .eq("user_id", user.id)
        .single();

      if (customerCheck?.is_admin) {
        return navigate("/admin/dashboard");
      } else {
        return navigate("/dashboard");
      }
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
