import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
        }
      );

      alert("OTP sent to your email");

      navigate("/reset-password", {
        state: {
          email,
        },
      });
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to send OTP"
      );
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Send OTP
      </button>
    </div>
  );
}

export default ForgotPassword;