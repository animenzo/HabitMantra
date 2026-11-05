import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", loginData);
      login(res.data.token, res.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/signup", signupData);

      // auto-login after signup
      const res = await API.post("/auth/login", {
        email: signupData.email,
        password: signupData.password,
      });

      login(res.data.token, res.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[580px] md:min-h-[620px] flex items-center justify-center p-3 sm:p-6 bg-slate-950/50 backdrop-blur-md rounded-2xl">
      <div
        className={`bg-white rounded-2xl md:rounded-3xl shadow-2xl relative overflow-hidden w-full max-w-sm md:max-w-4xl min-h-[560px] md:min-h-[540px] border border-slate-200/90 transition-all duration-300 ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
      >
        {/* ================= SIGN UP FORM ================= */}
        <div
          className={`form-container sign-up-container absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-full md:w-1/2 flex items-center justify-center 
            ${
              isRightPanelActive
                ? "opacity-100 z-50 md:translate-x-full animate-show md:animate-none"
                : "opacity-0 z-0 pointer-events-none md:pointer-events-auto"
            }`}
        >
          <form
            onSubmit={handleSignup}
            className="bg-white flex flex-col items-center justify-center h-full px-6 sm:px-10 md:px-12 text-center w-full"
          >
            <div className="mb-4">
              <h2 className="font-extrabold text-slate-900 text-2xl tracking-tight">
                Create Account
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Begin tracking habits and achieving daily goals
              </p>
            </div>

            {error && (
              <div className="w-full mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200/80 text-red-600 text-xs font-medium flex items-center gap-2 text-left">
                <FiAlertCircle className="shrink-0 text-sm" />
                <span>{error}</span>
              </div>
            )}

            <div className="w-full space-y-2.5 my-1">
              {/* Name Field */}
              <div className="relative w-full">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all"
                />
              </div>

              {/* Email Field */}
              <div className="relative w-full">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="relative w-full">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password (min. 6 characters)"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-0.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button with Loader */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>

            {/* Mobile Switch to Sign In */}
            <p className="md:hidden text-xs text-slate-500 mt-6">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setIsRightPanelActive(false);
                }}
                className="text-indigo-600 font-bold hover:underline cursor-pointer ml-1"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>

        {/* ================= SIGN IN FORM ================= */}
        <div
          className={`form-container sign-in-container absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-full md:w-1/2 flex items-center justify-center z-10
            ${
              isRightPanelActive
                ? "md:translate-x-full opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto"
                : "opacity-100"
            }`}
        >
          <form
            onSubmit={handleLogin}
            className="bg-white flex flex-col items-center justify-center h-full px-6 sm:px-10 md:px-12 text-center w-full"
          >
            <div className="mb-5">
              <h2 className="font-extrabold text-slate-900 text-2xl tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your details to access your habits
              </p>
            </div>

            {error && (
              <div className="w-full mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200/80 text-red-600 text-xs font-medium flex items-center gap-2 text-left">
                <FiAlertCircle className="shrink-0 text-sm" />
                <span>{error}</span>
              </div>
            )}

            <div className="w-full space-y-3 my-1">
              {/* Email Field */}
              <div className="relative w-full">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="relative w-full">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-0.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="w-full flex justify-end my-2">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button with Loader */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {/* Mobile Switch to Sign Up */}
            <p className="md:hidden text-xs text-slate-500 mt-6">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setIsRightPanelActive(true);
                }}
                className="text-indigo-600 font-bold hover:underline cursor-pointer ml-1"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>

        {/* ================= DESKTOP SLIDING OVERLAY ================= */}
        <div
          className={`overlay-container hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 ease-in-out z-100 ${
            isRightPanelActive ? "-translate-x-full" : ""
          }`}
        >
          <div
            className={`overlay bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white relative -left-full h-full w-[200%] transform transition-transform duration-500 ease-in-out ${
              isRightPanelActive ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Left Overlay Panel (Shows when signing up) */}
            <div
              className={`overlay-panel overlay-left absolute flex flex-col items-center justify-center p-8 text-center top-0 h-full w-1/2 transform 
                transition-transform duration-500 ease-in-out ${
                  isRightPanelActive ? "translate-x-0" : "-translate-x-1/5"
                }`}
            >
              <h3 className="font-extrabold m-0 text-2xl text-white tracking-tight">
                Welcome Back!
              </h3>
              <p className="text-xs text-indigo-100/90 leading-relaxed my-4 px-6 max-w-xs">
                To stay connected with your habit streaks and daily reflection, sign in with your account.
              </p>
              <button
                type="button"
                className="rounded-xl border border-white/80 bg-white/10 hover:bg-white hover:text-indigo-700 text-white text-xs font-bold py-2.5 px-8 tracking-wider uppercase transition-all active:scale-95 cursor-pointer shadow-sm"
                onClick={() => {
                  setError("");
                  setIsRightPanelActive(false);
                }}
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay Panel (Shows when signing in) */}
            <div
              className={`overlay-panel overlay-right absolute flex flex-col items-center justify-center p-8 text-center top-0 h-full w-1/2 right-0 transform transition-transform duration-500 ease-in-out ${
                isRightPanelActive ? "translate-x-1/5" : "translate-x-0"
              }`}
            >
              <h3 className="font-extrabold m-0 text-2xl text-white tracking-tight">
                New to HabitMantra?
              </h3>
              <p className="text-xs text-indigo-100/90 leading-relaxed my-4 px-6 max-w-xs">
                Build lasting self-discipline with habit tracking, time blocks, and structured reflection.
              </p>
              <button
                type="button"
                className="rounded-xl border border-white/80 bg-white/10 hover:bg-white hover:text-indigo-700 text-white text-xs font-bold py-2.5 px-8 tracking-wider uppercase transition-all active:scale-95 cursor-pointer shadow-sm"
                onClick={() => {
                  setError("");
                  setIsRightPanelActive(true);
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
