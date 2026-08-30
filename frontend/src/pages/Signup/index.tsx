import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../components/AuthLayout";
import AlertCard from "../../components/AlertCard";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setAlert(null);

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setAlert({
        type: "error",
        message: "Please fill all the fields.",
      });
      return;
    }

    if (password.length < 6) {
      setAlert({
        type: "error",
        message:
          "Password must be at least 6 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    try {
      setLoading(true);

 const response = await axios.post(
  `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
        {
          name,
          email,
          password,
        }
      );

      setAlert({
        type: "success",
        message:
          response.data.message ||
          "Account created successfully!",
      });

      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            email,
          },
        });
      }, 700);
    } catch (error: any) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">
          Create account
        </h1>

        <p className="mt-2 mb-7 text-[#8A9A8D]">
          Join ChatFlow and start chatting.
        </p>

        {alert && (
          <AlertCard
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form
          onSubmit={handleSignup}
          className="space-y-4"
        >
          {/* Name */}

          <div>
            <label className="mb-2 block text-sm text-[#B8C5BA]">
              Name
            </label>

            <input
              type="text"
              value={name}
              placeholder="Enter your name"
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-xl border border-[#1B3020] bg-[#070C08] px-4 py-3 text-white outline-none placeholder:text-[#526057] transition focus:border-[#39FF88] focus:ring-2 focus:ring-[#39FF88]/10"
            />
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm text-[#B8C5BA]">
              Email
            </label>

            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl border border-[#1B3020] bg-[#070C08] px-4 py-3 text-white outline-none placeholder:text-[#526057] transition focus:border-[#39FF88] focus:ring-2 focus:ring-[#39FF88]/10"
            />

            <input
  type="text"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  placeholder="@username"
  className="w-full rounded-xl border border-[#263B2A] bg-[#0B120D] px-4 py-3 text-white outline-none focus:border-[#39FF88]"
/>

          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm text-[#B8C5BA]">
              Password
            </label>

            <input
              type="password"
              value={password}
              placeholder="Minimum 6 characters"
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-xl border border-[#1B3020] bg-[#070C08] px-4 py-3 text-white outline-none placeholder:text-[#526057] transition focus:border-[#39FF88] focus:ring-2 focus:ring-[#39FF88]/10"
            />
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-2 block text-sm text-[#B8C5BA]">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              placeholder="Confirm your password"
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full rounded-xl border border-[#1B3020] bg-[#070C08] px-4 py-3 text-white outline-none placeholder:text-[#526057] transition focus:border-[#39FF88] focus:ring-2 focus:ring-[#39FF88]/10"
            />
          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] py-3.5 font-bold text-black transition hover:scale-[1.01] hover:shadow-lg hover:shadow-[#39FF88]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8A9A8D]">
          Already have an account?{" "}

          <Link
            to="/login"
            className="font-semibold text-[#39FF88] transition hover:text-[#C7FF4D]"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Signup;