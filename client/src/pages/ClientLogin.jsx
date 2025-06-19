import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const ClientLogin = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("start");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + "/post-login",
      },
    });

    if (error) {
      console.error('Google sign-in error:', error.message);
    }
  };

  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Email login failed:", error.message);
      setError("Invalid email or password.");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({ phone });

    if (error) {
      setError("Failed to send code. Check your number.");
    } else {
      setStep("otp");
    }
  };

  const handleVerifyOtp = async () => {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (error) {
      setError("Invalid code.");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Customer Login</h2>

        {error && <div className="text-red-600 text-sm text-center mb-4">{error}</div>}

        {step === "start" && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 mb-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 mb-4"
            />
            <button
              onClick={handleEmailLogin}
              className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition mb-4"
            >
              Login with Email
            </button>

            <div className="text-center text-sm text-gray-500 mb-4">or</div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 border border-black text-black rounded-lg hover:bg-gray-100 transition mb-4"
            >
              Sign in with Google
            </button>

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 mb-4"
            />
            <button
              onClick={handleSendOtp}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
            >
              Send Code
            </button>

            <p className="text-sm text-center mt-4">
              New here?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register now
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
              className="w-full p-3 rounded-lg border border-gray-300 mb-4"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Verify Code
            </button>
            <p
              className="text-sm text-blue-600 text-center mt-3 cursor-pointer hover:underline"
              onClick={() => setStep("start")}
            >
              Back to Login Options
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientLogin;
