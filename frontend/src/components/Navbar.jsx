import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const [open, setOpen] = useState(false);
const { logout } = useAuth();
 
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition-all ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;
     const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };
   
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1 className="font-bold text-lg text-indigo-600">
            HabitTracker
          </h1>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-2">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/notespage" className={linkClass}>
              MyNotes
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
            <button className="bg-red-400 text-white font-semibold rounded-md px-3 py-1 cursor-pointer hover:bg-red-500" onClick={logout}>Logout</button>

          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-3 flex flex-col gap-2 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-gray-200 shadow-lg">
            <NavLink
              to="/dashboard"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/notespage"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              MyNotes
            </NavLink>

            <NavLink
              to="/profile"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Profile
            </NavLink>
            <button className="bg-red-400 text-white font-semibold rounded-md px-3 py-1 cursor-pointer hover:bg-red-500"  onClick={handleLogout}>Logout</button>


          </div>
        )}
      </div>
    </nav>
  );
}
