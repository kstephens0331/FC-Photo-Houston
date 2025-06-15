import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const PostLoginRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const routeUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/login");

      const { data } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      navigate(data ? "/dashboard" : "/register-complete");
    };

    routeUser();
  }, [navigate]);

  return <p className="text-center mt-40 text-lg">Redirecting...</p>;
};

export default PostLoginRedirect;
