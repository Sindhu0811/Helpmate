import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/setting.css";

export default function SettingsPage() {
  const navigate = useNavigate();

  /* ======================================================
     🔒 SESSION GUARD
     ====================================================== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    JSON.parse(localStorage.getItem("notificationsEnabled")) ?? true
  );

  // Alert message state
  const [alertMsg, setAlertMsg] = useState("");

  // Toggle Notifications
  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notificationsEnabled", newValue);
  };

  // Handle Location click (cannot turn off)
  const handleLocationClick = () => {
    setAlertMsg("You can't turn off location sharing!");
    setTimeout(() => setAlertMsg(""), 3000);
  };

  /* ======================================================
     🚪 LOGOUT (FIXED – NO clear())
     ====================================================== */
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("locationAllowed");
    navigate("/auth", { replace: true });
  };

  return (
    <div className="faq-page">
      <div className="faq-card-box">
        <div className="faq-header">
          <h2>Settings</h2>
          <p>Manage your preferences</p>
        </div>

        {/* Notifications */}
        <div className="faq-item">
          <div className="faq-question">
            <div className="contact-left">
              <div className="setting-icon blue">🔔</div>
              <div className="contact-info">
                <h4>Notifications</h4>
                <p>Receive emergency alerts</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={handleToggleNotifications}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {/* Location Sharing */}
        <div className="faq-item">
          <div className="faq-question">
            <div className="contact-left">
              <div className="setting-icon green">📍</div>
              <div className="contact-info">
                <h4>Location Sharing</h4>
                <p>Share location during emergencies</p>
              </div>
            </div>
            <label className="switch" onClick={handleLocationClick}>
              <input type="checkbox" checked readOnly />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {alertMsg && <div className="alert-msg">{alertMsg}</div>}

        <button className="logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}