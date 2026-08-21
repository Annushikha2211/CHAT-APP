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
          "Password reset failed"
      );
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>

      <p>{email}</p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) =>
          setNewPassword(e.target.value)
        }
      />

      <button onClick={handleReset}>
        Reset Password
      </button>
    </div>
  );
}

export default ResetPassword;