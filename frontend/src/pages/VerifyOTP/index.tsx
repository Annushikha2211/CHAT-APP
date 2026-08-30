import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async () => {
    if (!email) {
      alert("Email not found. Please signup again.");
      navigate("/signup");
      return;
    }

    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

     await axios.post(
  `${import.meta.env.VITE_BASE_URL}/api/auth/verify-signup-otp`,
        {
          email,
          otp: otp.trim(),
        }
      );

      alert("Account created successfully 🎉");

      navigate("/login");
    } catch (error: any) {
      console.log("OTP verification error:", error);

      alert(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050805] px-4 text-white">

      <div className="w-full max-w-md rounded-2xl border border-[#263B2A] bg-[#0B120D] p-6">

        <h1 className="text-2xl font-bold text-[#39FF88]">
          Verify OTP
        </h1>

        <p className="mt-2 text-sm text-[#718078]">
          OTP sent to:
        </p>

        <p className="mt-1 break-all text-sm text-white">
          {email || "Email not found"}
        </p>

        <div className="mt-6">

          <label className="mb-2 block text-sm text-[#AAB5AE]">
            Enter OTP
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
            className="w-full rounded-xl border border-[#263B2A] bg-[#080D09] px-4 py-3 text-white outline-none focus:border-[#39FF88]"
          />

        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] px-4 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="mt-4 w-full text-sm text-[#718078] hover:text-[#39FF88]"
        >
          ← Back to Signup
        </button>

      </div>

    </div>
  );
}

export default VerifyOTP;