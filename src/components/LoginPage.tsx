import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Zap, AlertCircle, ShieldCheck } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin1234";

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  // Particle positions
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate a brief auth delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);

    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("zephyr_auth", "true");
      onLogin();
    } else {
      setError("Invalid credentials. Please check your email and password.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#020817", fontFamily: "Inter, sans-serif" }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full blur-3xl opacity-25"
          style={{
            width: "500px",
            height: "500px",
            top: "-120px",
            left: "-120px",
            background: "radial-gradient(circle, #2563EB 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-15"
          style={{
            width: "400px",
            height: "400px",
            bottom: "-80px",
            right: "-80px",
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-10"
          style={{
            width: "300px",
            height: "300px",
            top: "40%",
            right: "20%",
            background: "radial-gradient(circle, #60A5FA 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: "rgba(59, 130, 246, 0.4)",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { opacity: 1, y: 0, scale: 1 }}
        transition={shake ? { duration: 0.5 } : { duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md mx-4 z-10"
      >
        {/* Top glow line */}
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
          style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)" }}
        />

        <div
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(8, 15, 31, 0.95) 0%, rgba(5, 11, 24, 0.98) 100%)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 32px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.05), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Inner corner accent */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }}
          />

          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl font-bold text-white text-2xl shadow-2xl relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 40%, #3B82F6 100%)",
                  boxShadow: "0 0 40px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <span className="relative z-10" style={{ fontFamily: "'DM Serif Display', serif" }}>Z</span>
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: "radial-gradient(circle at 30% 30%, white, transparent)" }}
                />
              </div>
              {/* Orbit ring */}
              <div
                className="absolute -inset-2 rounded-3xl"
                style={{
                  border: "1px solid rgba(59, 130, 246, 0.25)",
                  borderRadius: "18px",
                }}
              />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-white text-2xl font-semibold tracking-widest"
                style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "0.18em" }}
              >
                ZEPHYR
              </span>
              <Zap className="h-4 w-4" style={{ color: "#60A5FA" }} />
            </div>
            <span
              className="text-[10px] uppercase tracking-widest font-medium"
              style={{ color: "rgba(96, 165, 250, 0.7)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              Executive Studio · Admin Portal
            </span>
          </div>

          {/* Divider */}
          <div
            className="mb-6 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)" }}
          />

          {/* Header text */}
          <div className="mb-6 text-center">
            <h1 className="text-xl text-white font-normal mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Welcome Back
            </h1>
            <p className="text-xs" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
              Sign in to access your executive dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(148, 163, 184, 0.8)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200"
                  style={{ color: emailFocused ? "#60A5FA" : "rgba(100, 116, 139, 0.6)" }}
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-200"
                  style={{
                    background: emailFocused ? "rgba(37, 99, 235, 0.06)" : "rgba(5, 11, 24, 0.9)",
                    border: emailFocused
                      ? "1px solid rgba(59, 130, 246, 0.5)"
                      : "1px solid rgba(59, 130, 246, 0.15)",
                    color: "#E8F0FE",
                    outline: "none",
                    boxShadow: emailFocused ? "0 0 0 3px rgba(59, 130, 246, 0.08)" : "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(148, 163, 184, 0.8)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200"
                  style={{ color: passFocused ? "#60A5FA" : "rgba(100, 116, 139, 0.6)" }}
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm transition-all duration-200"
                  style={{
                    background: passFocused ? "rgba(37, 99, 235, 0.06)" : "rgba(5, 11, 24, 0.9)",
                    border: passFocused
                      ? "1px solid rgba(59, 130, 246, 0.5)"
                      : "1px solid rgba(59, 130, 246, 0.15)",
                    color: "#E8F0FE",
                    outline: "none",
                    boxShadow: passFocused ? "0 0 0 3px rgba(59, 130, 246, 0.08)" : "none",
                    fontFamily: "Inter, sans-serif",
                    letterSpacing: showPassword ? "normal" : "0.15em",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: "rgba(100, 116, 139, 0.6)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#60A5FA"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(100, 116, 139, 0.6)"; }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                  }}
                >
                  <AlertCircle className="h-4 w-4 shrink-0" style={{ color: "#F87171" }} />
                  <span className="text-xs" style={{ color: "#FCA5A5" }}>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-300 mt-2 relative overflow-hidden disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "rgba(37, 99, 235, 0.5)"
                  : "linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)",
                boxShadow: loading ? "none" : "0 4px 20px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(59, 130, 246, 0.55), inset 0 1px 0 rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {loading ? (
                <>
                  <div
                    className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  />
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer hint */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(59, 130, 246, 0.08)" }}>
            <div
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5"
              style={{
                background: "rgba(37, 99, 235, 0.05)",
                border: "1px solid rgba(59, 130, 246, 0.1)",
              }}
            >
              <Lock className="h-3 w-3" style={{ color: "rgba(96, 165, 250, 0.6)" }} />
              <span className="text-[10px]" style={{ color: "rgba(100, 116, 139, 0.7)", fontFamily: "'JetBrains Mono', monospace" }}>
                Secure Admin Access · Zephyr Executive Studio
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
