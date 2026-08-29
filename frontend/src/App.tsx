import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import CardsPage from "./pages/Cards";
import Call from "./pages/Call";
import FriendRequests from "./pages/FriendRequests";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


function App() {
  return (
    <Routes>


      {/* =========================
          AUTH ROUTES
      ========================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOTP />}
      />


      {/* =========================
          HOME
      ========================= */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />


      {/* =========================
          CHAT
      ========================= */}

      <Route
        path="/chat/:userId"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />


      {/* =========================
          PROFILE
      ========================= */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* =========================
          CALL
      ========================= */}

      <Route
        path="/call/:userId"
        element={<Call />}
      />


      {/* =========================
          CARDS
      ========================= */}

      <Route
        path="/cards"
        element={<CardsPage />}
      />


<Route
  path="/friend-requests"
  element={
    <ProtectedRoute>
      <FriendRequests />
    </ProtectedRoute>
  }
/>

<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

    </Routes>
  );
}

export default App;
