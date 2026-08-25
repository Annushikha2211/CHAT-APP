import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050805] flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-[-150px] right-[-100px] h-[350px] w-[350px] rounded-full bg-[#39FF88]/10 blur-3xl" />

      <div className="absolute bottom-[-150px] left-[-100px] h-[350px] w-[350px] rounded-full bg-[#C7FF4D]/5 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] flex items-center justify-center shadow-lg shadow-[#39FF88]/20">
              <span className="text-black font-black text-xl">
                C
              </span>
            </div>

            <span className="text-2xl font-bold text-white">
              Chat<span className="text-[#39FF88]">Flow</span>
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-[#1B3020] bg-[#0B120D]/90 backdrop-blur-xl p-7 shadow-2xl shadow-black/40">
          {children}
        </div>

        <p className="text-center text-xs text-[#66756A] mt-6">
          Secure • Private • Simple
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;