import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import Schedule from "./components/Schedule";
import Notifications from "./components/Notifications";
import CareReports from "./components/CareReports";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NurseDashboard.css";

export function NurseDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [nurseId, setNurseId] = useState(null);

  useEffect(() => {
    const storedNurseId = localStorage.getItem('nurseId');
    if (storedNurseId) {
      setNurseId(storedNurseId);
    }
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content expanded-content">
        {activeTab === "profile" && <Profile nurseId={nurseId} />}
        {activeTab === "schedule" && <Schedule nurseId={nurseId} />}
        {activeTab === "notifications" && <Notifications />} {/* Retrait de la prop nurseId */}
        {activeTab === "reports" && <CareReports nurseId={nurseId} />}
      </main>
    </div>
  );
}