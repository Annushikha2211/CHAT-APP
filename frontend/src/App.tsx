// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Home from "./pages/Home";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import Chat from "./pages/Chat";

// function App() {
//   return (
    
//     <Routes>
// <Route path="/login" element={<Login/>}/>
// <Route path="/signup" element={<Signup/>}/>
// <Route 
// path="/"
//  element={<ProtectedRoute>
//   <Home/>
//  </ProtectedRoute>}/>
//     </Routes>

  


//   );
// }

// export default App;  

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import Chat from "./pages/Chat";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/idex";
// import VerifyOTP from "./pages/VerifyOTP";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:userId"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
  path="/verify-otp"
  element={<VerifyOTP />}
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
