import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotesPage from "./pages/NotesPage";
import Login from "./components/home/Login";
import PrivateRoute from "./routes/PrivateRoutes";
import Home from "./pages/Home";
import { useAuth } from "./context/AuthContext";
import ResetPassword from "./components/home/ResetPassword";
import ForgotPassword from "./components/home/ForgotPassword";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* ROOT */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        {/* PUBLIC */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/notespage"
          element={
            <PrivateRoute>
              <NotesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
