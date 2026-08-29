import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email: email.trim(),
        }
      );

      alert("OTP sent to your email");

      navigate("/reset-password", {
        state: {
          email: email.trim(),
        },
      });
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050805] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-[#18291D] bg-[#0B120D] p-6 shadow-2xl">

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] text-xl font-black text-black">
            C
          </div>

          <h1 className="text-2xl font-bold">
            Forgot Password
          </h1>

          <p className="mt-2 text-sm text-[#718078]">
            Enter your registered email and we'll send you
            an OTP.
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-[#A9B6AC]">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            autoComplete="email"
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-xl border border-[#1B3020] bg-[#070C08] px-4 py-3 text-white outline-none transition placeholder:text-[#526057] focus:border-[#39FF88] focus:ring-2 focus:ring-[#39FF88]/10"
          />
        </div>

        {/* Send OTP */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-4 w-full text-sm text-[#718078] transition hover:text-[#39FF88]"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;