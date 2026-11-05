import { useState, useEffect } from "react";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiLayout,
  FiCalendar,
  FiCompass,
  FiFileText,
  FiBookOpen,
  FiMic,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
} from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: FiLayout },
  { label: "MyBoards", path: "/notespage", icon: FiFileText },
  { label: "MyDiaries", path: "/mydiary", icon: FiBookOpen },
  { label: "Profile", path: "/profile", icon: FiUser },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userName = user?.name || "Habit Practitioner";
  const userInitial = (user?.name?.charAt(0) || "H").toUpperCase();
  const userEmail = user?.email || "";

  // Auto-close mobile drawer on route transition
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ================= BRAND LOGO & TITLE ================= */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl py-1 pr-2 transition-transform duration-150 active:scale-95"
            aria-label="HabitMantra Home"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center p-1.5 transition-all duration-200 group-hover:border-indigo-300 group-hover:shadow-indigo-500/10">
              <img
                src="/logo.svg"
                alt="HabitMantra Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                Habit<span className="text-indigo-600 font-black">Mantra</span>
              </span>
            </div>
          </Link>

          {/* ================= DESKTOP NAVIGATION ITEMS ================= */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isActive
                        ? "bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`text-sm shrink-0 transition-colors ${
                          isActive
                            ? "text-indigo-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                      {isActive && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-indigo-600 ml-0.5 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* ================= DESKTOP USER SECTION & LOGOUT ================= */}
          <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-200/80">
            {/* Quick Profile Badge */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? "bg-indigo-50/90 border-indigo-200 text-indigo-700 shadow-2xs"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200/70 text-slate-700 hover:text-slate-900"
                }`
              }
              title={`View ${userName}'s Profile`}
            >
              <div className="w-6 h-6 rounded-md bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
                {userInitial}
              </div>
              <span className="max-w-[88px] truncate font-medium">
                {userName.split(" ")[0]}
              </span>
            </NavLink>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all duration-150 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              title="Sign out of HabitMantra"
              aria-label="Sign out"
            >
              <FiLogOut className="text-sm shrink-0" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>

          {/* ================= MOBILE / TABLET MENU TOGGLE BUTTON ================= */}
          <div className="flex lg:hidden items-center gap-2">
            <NavLink
              to="/profile"
              className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              title="Profile"
              aria-label="Profile"
            >
              {userInitial}
            </NavLink>

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-expanded={open}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            >
              {open ? (
                <FiX className="text-xl" aria-hidden="true" />
              ) : (
                <FiMenu className="text-xl" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE / TABLET COLLAPSIBLE DRAWER ================= */}
        {open && (
          <div className="lg:hidden py-4 border-t border-slate-200/80 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* User Info Header inside Mobile Drawer */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-2xs shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {userName}
                  </p>
                  {userEmail && (
                    <p className="text-xs text-slate-500 truncate">
                      {userEmail}
                    </p>
                  )}
                </div>
              </div>
              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-1.5 rounded-lg shrink-0"
              >
                View Profile
              </NavLink>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs"
                          : "text-slate-700 hover:bg-slate-100/80 border border-transparent"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isActive
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <Icon className="text-sm" aria-hidden="true" />
                          </div>
                          <span>{item.label}</span>
                        </div>
                        <FiChevronRight
                          className={`text-sm ${
                            isActive ? "text-indigo-500" : "text-slate-400"
                          }`}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Mobile Drawer Logout Action */}
            <div className="pt-2 border-t border-slate-200/80">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200/70 transition-colors cursor-pointer"
              >
                <FiLogOut className="text-base" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
