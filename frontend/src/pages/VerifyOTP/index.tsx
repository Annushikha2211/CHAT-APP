import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyOTP() {
  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/verify-signup-otp",
        {
          email,
          otp,
        }
      );

      alert("Account created successfully");

      navigate("/login");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    }
  };

  return (
    <div>
      <h1>Verify Email</h1>

      <p>OTP sent to: {email}</p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify}>
        Verify OTP
      </button>
    </div>
  );
}

export default VerifyOTP;