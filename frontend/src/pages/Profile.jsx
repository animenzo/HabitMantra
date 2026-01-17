import React from "react";
import Heatmap from "../components/Heatmap";
import MonthComparison from "../components/stats/MonthComparision";
import Analytics from "../components/Analytics";
const Profile = () => {
  return (
    <div className="p-6 space-y-6 overflow-x-hidden">
      <h2 className="text-xl font-semibold">Statistics</h2>

      <Heatmap />
      <Analytics />

      <MonthComparison />
    </div>
  );
};

export default Profile;
