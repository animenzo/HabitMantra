import React from "react";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import { useEffect } from "react";
import API from "../services/api";
import HabitTable from "../components/HabitTable";
import MonthNavigation from "../components/MonthNavigation";
import WeeklyGoals from "../components/WeeklyGoals";
import DailyGoals from "../components/DailyGoals";
// import Charts from './components/Charts'
import { useState } from "react";
import SmartInsights from "../components/SmartInsights";
import HabitAnalytics from "../components/charts/HabitAnalytics";
import GlassCard from "../components/charts/GlassCard";
const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const load = async () => {
    const res = await API.get("/habits");
    setHabits(res.data);
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-6">My Habits</h1>
      <MonthNavigation
        year={year}
        month={month}
        setMonth={setMonth}
        setYear={setYear}
      />
      <div className="bg-card rounded-lg border border-border p-4 mb-4">
        <HabitForm refresh={load} />
        <HabitTable habits={habits} year={year} month={month} refresh={load} />
      </div>
      <div className="flex gap-6 overflow-x-auto  mb-4 items-start">
        <DailyGoals />
        <WeeklyGoals />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <SmartInsights />

        <GlassCard title="Habit Growth">
          <HabitAnalytics />
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
