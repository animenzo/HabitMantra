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
import MyDiary from "./pages/MyDiary";

/* --- Work-In-Progress Modules (Kept Local / In Building) ---
import EnglishCoach from "./pages/EnglishCoach";
import EnglishSession from "./pages/EnglishSession";
import EnglishSessionResult from "./pages/EnglishSessionResult";
import EnglishSessionReview from "./pages/EnglishSessionReview";
import EnglishProgressDashboard from "./pages/EnglishProgressDashboard";
import EnglishMissions from "./pages/EnglishMissions";
import RoadmapsWorkflowsPage from "./pages/RoadmapsWorkflowsPage";
import TimetablePage from "./pages/TimetablePage";
import FloatingAssistant from "./components/assistant/FloatingAssistant";
*/

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

        {/* PROTECTED - CORE PRODUCTION MODULES */}
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
          path="/mydiary"
          element={
            <PrivateRoute>
              <MyDiary />
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
