import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotesPage from "./pages/NotesPage";
import Login from "./components/home/Login";
import PrivateRoute from "./routes/PrivateRoutes";
import Home from "./pages/Home";

function App() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("token");

  // ❌ Hide Navbar on auth routes
  const hideNavbarRoutes = ["/login","/home"];
  const shouldShowNavbar =
    isAuthenticated && !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        {/* 🔁 ROOT REDIRECT */}
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

        {/* 🔐 AUTH */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 PROTECTED */}
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
      </Routes>
    </>
  );
}

export default App;
