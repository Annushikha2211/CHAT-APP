import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {

  const navigate=useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async (e: React.FormEvent) => {

    e.preventDefault();

  
    // 1. Check all fields
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all the fields");
      return;
    }

    // 2. Check password
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // 3. Send data to backend
    try {

      console.log("EMAIL SENT:", email);

      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      console.log(response.data);

      navigate("/verify-otp", {
  state: { email },
});

      navigate("/login");

    } catch (error: any) {

      console.log(error);

      alert(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div>

      <h1>Create Account</h1>

      <form onSubmit={handleSignup}>

        <label htmlFor="name">
          Name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          placeholder="Enter your Username"
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirmPassword">
          Confirm Password
        </label>

        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          placeholder="Enter your password again"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">
          Sign Up
        </button>

        <p>
          Already have an account?
          <Link to="/login">
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Signup;