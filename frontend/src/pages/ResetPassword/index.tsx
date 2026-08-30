import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleReset = async () => {
    if (!email) {
      alert("Email not found. Please request OTP again.");
      navigate("/forgot-password");
      return;
    }

    if (!otp || !newPassword) {
      alert("Please enter OTP and new password");
      return;
    }

    try {
  await axios.post(
  "http://localhost:5000/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      alert("Password reset successful");

      navigate("/login");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to reset password"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050805] text-white">

      <div className="w-full max-w-md rounded-2xl border border-[#18291D] bg-[#0B120D] p-6">

        <h1 className="mb-2 text-2xl font-bold">
          Reset Password
        </h1>

        <p className="mb-6 text-sm text-gray-400">
          Enter the OTP sent to {email}
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mb-4 w-full rounded-xl border border-[#1B3020] bg-[#070C08] px-4 py-3 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
          className="mb-4 w-full rounded-xl border border-[#1B3020] bg-[#070C08] px-4 py-3 text-white outline-none"
        />

        <button
          onClick={handleReset}
          className="w-full rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] px-4 py-3 font-semibold text-black"
        >
          Reset Password
        </button>

      </div>

    </div>
  );
}

export default ResetPassword;