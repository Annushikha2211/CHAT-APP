import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../components/AuthLayout";
// import AlertCard from "../../components/AlertCard";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);




  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email || !password) {
      window.alert("Fill all the fields");
      return;
    }

    try {
      setLoading(true);

    const response = await axios.post(
  `${import.meta.env.VITE_BASE_URL}/auth/login`,
  
  {
    email,
    password,
  }
);
       
      localStorage.setItem("token", response.data.token);

      

      navigate("/");
    } catch (error: any) {
      // alert(
      //   error.response?.data?.message ||
      //     "Login failed"
      // );

  window.alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back
        </h1>

        <p className="text-[#8A9A8D] mt-2 mb-7">
          Login to continue chatting.
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm text-[#B8C5BA] mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl border border-[#1B3020] bg-[#070C08] px-4 py-3 text-white outline-none placeholder:text-[#526057] focus:border-[#39FF88] focus:ring-2 focus:ring-[#39FF88]/10 transition"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[#B8C5BA]">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs text-[#39FF88] hover:text-[#C7FF4D]"
              >
                Forgot password?
              </Link>
            </div>

            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-xl border border-[#1B3020] bg-[#070C08] px-4 py-3 text-white outline-none placeholder:text-[#526057] focus:border-[#39FF88] focus:ring-2 focus:ring-[#39FF88]/10 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] py-3.5 font-bold text-black transition hover:scale-[1.01] hover:shadow-lg hover:shadow-[#39FF88]/20 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-[#8A9A8D] mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#39FF88] hover:text-[#C7FF4D]"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Login;