import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const PostLoginRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const finalizeLogin = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");

      // ✅ Guard against missing auth code
      if (!code) {
        console.warn("No auth code found in URL.");
        return navigate("/client-login");
      }

      // Step 1: Exchange OAuth code for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession();
      if (exchangeError) {
        console.error("OAuth exchange failed:", exchangeError.message);
        return navigate("/client-login");
      }

      // Step 2: Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Failed to get user after exchange.");
        return navigate("/client-login");
      }

      // Step 3: Check if user exists in customers table
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // Step 4: If not found, insert into customers
      if (!customer) {
        const { error: insertError } = await supabase.from("customers").insert({
          user_id: user.id,
          email: user.email,
          is_admin: false,
          profile_complete: false
        });

        if (insertError) {
          console.error("Error creating customer record:", insertError.message);
          return navigate("/client-login");
        }

        return navigate("/register-complete");
      }

      // Step 5: Redirect based on admin role
      if (customer.is_admin) {
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
