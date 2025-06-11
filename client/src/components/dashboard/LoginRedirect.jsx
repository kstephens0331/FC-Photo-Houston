import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const LoginRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/login");

      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) navigate("/dashboard");
      else navigate("/complete-profile");
    };

    check();
  }, [navigate]);

  return <p>Checking account...</p>;
};

export default LoginRedirect;
