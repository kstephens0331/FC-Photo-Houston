import { createContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }

      // Clean up token from URL after OAuth login
      if (window.location.hash.includes("access_token")) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      setLoading(false);
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          setSession(session);
          setUser(session?.user ?? null);
        } else if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
        }

        // ✅ Add this here to unblock CustomerRoute
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};