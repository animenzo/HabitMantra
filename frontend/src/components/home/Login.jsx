import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup"); // signup | otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await API.post("/auth/login", loginData);
    login(res.data.token, res.data.user);

    // after successful login/signup
    navigate("/dashboard", { replace: true });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/signup", signupData);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, []);
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };
  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/verify-otp", {
        email: signupData.email,
        otp,
      });

      login(res.data.token, res.data.user);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-linear-to-br from-green-100 to-green-300 font-poppins overflow-hidden w-full lg:h-[80vh] p-4 md:p-0">
      <span className="block py-1 px-3 rounded-full bg-red-500/10 border border-red-500/20  text-red-500 text-sm font-semibold tracking-widest mb-1">
        {error && <p className="">{error}</p>}
      </span>
      <div
        className={`bg-white rounded-2xl md:rounded-xl shadow-xl md:shadow-2xl relative overflow-hidden w-full max-w-100 md:max-w-3xl min-h-150 md:min-h-120 transition-all duration-300 ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
      >
        {/* Sign Up Form */}
        <div
          className={`form-container sign-up-container absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full md:w-1/2 flex items-center justify-center 
            ${
              isRightPanelActive
                ? "opacity-100 z-50 md:translate-x-full animate-show md:animate-none"
                : "opacity-0 z-0 pointer-events-none md:pointer-events-auto"
            }`}
        >
          <form
            onSubmit={handleSignup}
            className="bg-white flex flex-col items-center justify-center h-full px-8 md:px-12 text-center w-full"
          >
            {/* Mobile Illustration */}
            {/* <div className="md:hidden w-full mb-4">
              <AnimatedFarmIllustration />
            </div> */}

            <h1 className="font-bold m-0 text-green-800 text-2xl">
              Create Account
            </h1>
            <div className="social-container my-3 md:my-5">
              <GoogleLogin
                onSuccess={async (res) => {
                  try {
                    const response = await API.post("/auth/google", {
                      credential: res.credential,
                    });

                    login(response.data.token, response.data.user);
                    navigate("/dashboard", { replace: true });
                  } catch {
                    setError("Google login failed");
                  }
                }}
                onError={() => setError("Google login failed")}
              />
            </div>
            <span className="text-xs">or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
              className="bg-gray-100 border-none p-3 my-2 w-full rounded transition-colors duration-300 focus:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              className="bg-gray-100 border-none p-3 my-2 w-full rounded transition-colors duration-300 focus:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="bg-gray-100 border-none p-3 my-2 w-full rounded transition-colors duration-300 focus:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor">
                    <path d="M1 1l18 18" />
                    <path d="M10 4c-5 0-9 6-9 6s4 6 9 6 9-6 9-6-4-6-9-6z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor">
                    <path d="M10 4c-5 0-9 6-9 6s4 6 9 6 9-6 9-6-4-6-9-6z" />
                    <circle cx="10" cy="10" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <button
              className="rounded-full border border-green-600 bg-green-600 text-white text-xs font-bold py-3 px-11 tracking-widest uppercase transition-transform duration-80 ease-in active:scale-95 focus:outline-none shadow-md mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
            {step === "otp" && (
              <>
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-gray-100 p-3 my-2 w-full rounded"
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="rounded-full bg-green-600 cursor-pointer text-white py-3 px-11"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

            {/* Mobile Toggle */}
            <p className="md:hidden text-xs mt-6">
              Already have an account?{" "}
              <button
                type="button"
                onClick={handleSignInClick}
                className="text-green-600 font-bold bg-transparent border-none p-0 underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>

        {/* Sign In Form */}
        <div
          className={`form-container sign-in-container absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full md:w-1/2 flex items-center justify-center z-10
            ${
              isRightPanelActive
                ? "md:translate-x-full opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto"
                : "opacity-100"
            }`}
        >
          <form
            onSubmit={handleLogin}
            className="bg-white flex flex-col items-center justify-center h-full px-8 md:px-12 text-center w-full"
          >
            {/* Mobile Illustration */}
            {/* <div className="md:hidden w-full mb-4">
              <AnimatedFarmIllustration />
            </div> */}

            <h1 className="font-bold m-0 text-green-800 text-2xl">Sign in</h1>
            <div className="social-container my-3 md:my-5">
              <GoogleLogin
                onSuccess={async (res) => {
                  try {
                    const response = await API.post("/auth/google", {
                      credential: res.credential,
                    });

                    login(response.data.token, response.data.user);
                    navigate("/dashboard", { replace: true });
                  } catch {
                    setError("Google login failed");
                  }
                }}
                onError={() => setError("Google login failed")}
              />
            </div>
            <span className="text-xs">or use your account</span>
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="bg-gray-100 border-none p-3 my-2 w-full rounded transition-colors duration-300 focus:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="bg-gray-100 border-none p-3 my-2 w-full rounded transition-colors duration-300 focus:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor">
                    <path d="M1 1l18 18" />
                    <path d="M10 4c-5 0-9 6-9 6s4 6 9 6 9-6 9-6-4-6-9-6z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor">
                    <path d="M10 4c-5 0-9 6-9 6s4 6 9 6 9-6 9-6-4-6-9-6z" />
                    <circle cx="10" cy="10" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <a
              href="#"
              className="text-gray-800 text-sm no-underline my-4 hover:text-green-700"
            >
              Forgot your password?
            </a>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full border border-green-600 bg-green-600 text-white text-xs font-bold py-3 px-11 tracking-widest uppercase hover:bg-green-700 cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            {/* Mobile Toggle */}
            <p className="md:hidden text-xs mt-6">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={handleSignUpClick}
                className="text-green-600 font-bold underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>

        {/* Overlay / Slider (Hidden on Mobile) */}
        <div
          className={`overlay-container hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-100 ${
            isRightPanelActive ? "-translate-x-full" : ""
          }`}
        >
          <div
            className={`overlay bg-linear-to-r from-green-700 to-green-500 bg-no-repeat bg-cover bg-center text-white relative -left-full h-full w-[200%] transform transition-transform duration-600 ease-in-out ${
              isRightPanelActive ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Left Overlay Panel (Shows 'Welcome Back!' when signing up) */}
            <div
              className={`overlay-panel overlay-left absolute flex flex-col items-center justify-center p-10 text-center top-0 h-full w-1/2 transform 
                transition-transform duration-600 ease-in-out ${
                  isRightPanelActive ? "translate-x-0" : "-translate-x-1/5"
                }`}
            >
              {/* <AnimatedFarmIllustration /> */}
              <h1 className="font-bold m-0 text-2xl">Welcome Back!</h1>
              <p className="text-sm font-light leading-5 tracking-wider my-5 px-8">
                To keep connected with your habits, please login with your
                personal info
              </p>
              <button
                className="ghost rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-11 tracking-widest uppercase transition-transform duration-80 ease-in active:scale-95 focus:outline-none shadow-md cursor-pointer"
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay Panel (Shows 'New Harvest?' when signing in) */}
            <div
              className={`overlay-panel overlay-right absolute flex flex-col items-center justify-center p-10 text-center top-0 h-full w-1/2 right-0 transform transition-transform duration-600 ease-in-out ${
                isRightPanelActive ? "translate-x-1/5" : "translate-x-0"
              }`}
            >
              <h1 className="font-bold m-0 text-2xl">New Habits?</h1>
              <p className="text-sm font-light leading-5 tracking-wider my-5 px-8">
                Enter your personal details and start your journey with us
              </p>
              <button
                className="ghost rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-11 tracking-widest uppercase transition-transform duration-80 ease-in active:scale-95 focus:outline-none shadow-md"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
