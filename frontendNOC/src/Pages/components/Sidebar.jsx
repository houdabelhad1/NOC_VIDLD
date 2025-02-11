import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faCalendar, faBell, faFileAlt } from "@fortawesome/free-solid-svg-icons"

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Nurse Dashboard</h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FontAwesomeIcon icon={faUser} /> Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            <FontAwesomeIcon icon={faCalendar} /> Schedule
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <FontAwesomeIcon icon={faBell} /> Notifications
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <FontAwesomeIcon icon={faFileAlt} /> Care Reports
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar

