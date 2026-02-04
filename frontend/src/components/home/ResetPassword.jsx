import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import API from "../../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return setMessage("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await API.post(
        `/auth/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid/Expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="password"
          placeholder="Confirm password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p className="text-center text-sm text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
}
