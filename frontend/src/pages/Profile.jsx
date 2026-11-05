import React from "react";
import { useAuth } from "../context/AuthContext";
import Heatmap from "../components/Heatmap";
import MonthComparison from "../components/stats/MonthComparision";
import Analytics from "../components/Analytics";
import moment from "moment";
import {
  MdPerson,
  MdMail,
  MdCalendarToday,
  MdVerified,
  MdTrendingUp,
  MdLogout,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const userName = user?.name || "Habit Practitioner";
  const userInitial = userName.charAt(0).toUpperCase() || "H";
  const memberSince = user?.createdAt
    ? moment(user.createdAt).format("MMMM YYYY")
    : "January 2026";

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        {/* ================= USER PROFILE HERO CARD ================= */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Avatar Monogram */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 text-white font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-sm ring-4 ring-indigo-50 shrink-0">
                {userInitial}
              </div>

              {/* User Identity Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                    {userName}
                  </h1>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                    <MdVerified size={13} className="text-indigo-600" /> Active Member
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1 font-medium">
                  {user?.email && (
                    <span className="flex items-center gap-1">
                      <MdMail size={13} className="text-slate-400" />
                      {user.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MdCalendarToday size={12} className="text-slate-400" />
                    Member since {memberSince}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Quick Actions */}
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                title="Sign out of account"
              >
                <MdLogout size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </section>

        {/* ================= YEARLY ACTIVITY MATRIX ================= */}
        <section>
          <Heatmap />
        </section>

        {/* ================= PROGRESS & GROWTH CHARTS ================= */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            <MdTrendingUp className="text-indigo-600" size={15} />
            <span>Habit Trajectory & Completion Trends</span>
          </div>
          <Analytics />
        </section>

        {/* ================= HEAD-TO-HEAD MONTH COMPARISON ================= */}
        <section>
          <MonthComparison />
        </section>
      </div>
    </div>
  );
};

export default Profile;
