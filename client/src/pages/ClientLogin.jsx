import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import floralBg from "../assets/gray-floral.png";

const ClientLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("start");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/post-login",
      },
    });
    if (error) setError("Google login failed.");
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id)
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
