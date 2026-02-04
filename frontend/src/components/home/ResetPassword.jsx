import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { 
  MdLockOutline, 
  MdVisibility, 
  MdVisibilityOff, 
  MdCheckCircle, 
  MdErrorOutline,
  MdVpnKey
} from "react-icons/md";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const passwordsMatch = password && confirm && password === confirm;
  const passwordsMismatch = password && confirm && password !== confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (password !== confirm) {
      return setStatus({ type: "error", message: "Passwords do not match." });
    }

    try {
      setLoading(true);
      const res = await API.post(`/auth/reset-password/${token}`, { password });

      setStatus({ type: "success", message: "Password updated! Redirecting to login..." });
      
      // Redirect after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Invalid or expired reset link." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-indigo-600 p-8 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
            <MdVpnKey className="text-3xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-indigo-100 text-sm mt-2">
            Create a strong password to secure your account.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLockOutline className="text-gray-400 text-lg" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`
                    w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all
                    ${passwordsMismatch 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                      : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }
                  `}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLockOutline className={`text-lg ${passwordsMatch ? "text-green-500" : "text-gray-400"}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`
                    w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all
                    ${passwordsMismatch 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                      : passwordsMatch
                        ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                        : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }
                  `}
                />
                
                {/* Show/Hide Toggle (Shared for both technically, or just toggles view) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
              
              {/* Helper Text */}
              {passwordsMismatch && (
                <p className="text-xs text-red-500 mt-1 ml-1">Passwords do not match</p>
              )}
            </div>

            {/* Status Messages */}
            {status.message && (
              <div className={`flex items-center gap-2 p-4 rounded-lg text-sm border ${
                status.type === "error" 
                  ? "bg-red-50 text-red-700 border-red-100" 
                  : "bg-green-50 text-green-700 border-green-100"
              }`}>
                {status.type === "error" ? <MdErrorOutline size={20} /> : <MdCheckCircle size={20} />}
                <span>{status.message}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                disabled={loading}
                className={`
                  w-full py-3 rounded-xl font-bold text-white shadow-md transition-all
                  ${loading 
                    ? "bg-indigo-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.99]"
                  }
                `}
              >
                {loading ? "Updating Credentials..." : "Reset Password"}
              </button>
              
              <div className="text-center">
                <Link to="/login" className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors">
                  &larr; Back to Login
                </Link>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}