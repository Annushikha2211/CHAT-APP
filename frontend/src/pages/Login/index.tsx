import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../components/AuthLayout";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log(response.data);

      // JWT token browser mein save
      localStorage.setItem(
        "token",
        response.data.token
      );

      alert("Login successful");

      setEmail("");
      setPassword("");

      navigate("/");
    } catch (error: any) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <AuthLayout>
      <div>
        <h1>Welcome Back</h1>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>

          {/* Forgot Password */}
          <p>
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </p>

          <p>
            Don't have an account?{" "}
            <Link to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;