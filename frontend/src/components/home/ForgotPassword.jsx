import { useState } from "react";
import { Link } from "react-router-dom"; // Assuming you use React Router
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";
import { MdEmail, MdLockReset, MdArrowBack, MdCheckCircle, MdError } from "react-icons/md";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // types: 'success' | 'error' | ''

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      setStatus({ type: "success", message: res.data.message || "Reset link sent! Check your inbox." });
      setEmail(""); // Clear input on success
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "User not found or error occurred." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 p-3">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xs bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
      >
        <div className="p-4">
          
          {/* --- Header Icon --- */}
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center shadow-inner">
              <MdLockReset className="text-4xl text-indigo-600 animate-pulse" />
            </div>
          </div>

          <div className="text-center mb-3">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-500 text-sm">
              Don't worry! It happens. Please enter the email associated with your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- Input Field --- */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MdEmail className="text-gray-400 group-focus-within:text-indigo-500 transition-colors text-xl" />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>

            {/* --- Status Messages (Animated) --- */}
            <AnimatePresence mode="wait">
              {status.message && (
                <motion.div
                  key={status.type}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                    status.type === "success" 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}
                >
                  {status.type === "success" ? <MdCheckCircle size={18} /> : <MdError size={18} />}
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* --- Submit Button --- */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`
                w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 transition-all
                ${loading 
                  ? "bg-indigo-400 cursor-wait" 
                  : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                }
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Code"
              )}
            </motion.button>
          </form>
        </div>

        {/* --- Footer --- */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <MdArrowBack /> Back to Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}