import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import floralBg from "../assets/gray-floral.png";
import { useAuth } from "../hooks/useAuth";

const ClientLogin = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("start"); // 'start' or 'otp'
  const [error, setError] = useState("");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user;

          // Check if the customer already exists
          const { data: existingCustomer, error: fetchError } = await supabase
            .from("customers")
            .select("id")
            .eq("id", user.id) // assuming id is linked
            .single();

          if (!existingCustomer && !fetchError) {
            const { error: insertError } = await supabase
              .from("customers")
              .insert([
                {
                  id: user.id,
                  email: user.email,
                  full_name:
                    user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    "",
                },
              ]);

            if (insertError) {
              console.error("Customer insert failed:", insertError.message);
            }
          }

          // Redirect to dashboard
          navigate("/dashboard");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: 'https://fcphotohouston.com/post-login'
    }
  });

  if (error) {
    console.error("Google login failed:", error.message);
  }
};

  const handleSendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) setError("OTP request failed.");
    else setStep("otp");
  };

  const handleVerifyOtp = async () => {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (error) return setError("Invalid code.");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("customers")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    navigate(data ? "/dashboard" : "/register-complete");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 bg-repeat bg-fixed bg-[length:400px]"
      style={{ backgroundImage: `url(${floralBg})` }}
    >
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/30">
        <h2 className="text-3xl font-bold text-center mb-6">Customer Login</h2>

        {error && (
          <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
        )}

        {step === "start" && (
          <>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/70 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black mb-4"
            />
            <button
              onClick={handleSendOtp}
              className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition mb-4"
            >
              Send Code
            </button>
            <div className="text-center my-3 text-sm text-gray-600">or</div>
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-white border border-black text-black rounded-lg hover:bg-gray-100 transition"
            >
              Sign in with Google
            </button>
            <p className="text-sm mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/70 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black mb-4"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Verify Code
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientLogin;