import React, { useRef, useState, useEffect } from "react";
import "../styles/Home.css";

import { MdShield, MdWarning, MdPhone, MdInfo } from "react-icons/md";
import { addAlert, subscribeAlerts } from "../utils/recentAlerts";
import EmergencyTypeModal from "../components/EmergencyTypeModal";
import EmergencySuccessModal from "../components/EmergencySuccessModal";
import CancelEmergencyModal from "../components/CancelEmergencyModal";

export default function HomePage() {
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [selectedType, setSelectedType] = useState("");
  const [cancelActive, setCancelActive] = useState(false);
  const [cancelTime, setCancelTime] = useState(10);

  const [emergencyStatus, setEmergencyStatus] = useState("safe");

  // 🟢 NEW — helper name for "on the way"
  const [helperOnWay, setHelperOnWay] = useState("");

  // track seen helper responses
  const [seenResponses, setSeenResponses] = useState(new Set());

  // ---------------- RECENT ALERTS ----------------
  useEffect(() => {
    const unsubscribe = subscribeAlerts((latestAlerts) => {
      setAlerts(latestAlerts.slice(0, 3));
    });
    return unsubscribe;
  }, []);

  // ---------------- SOS STATUS POLLING ----------------
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://helpmate-production.up.railway.app/api/sos-status?userEmail=${user.email}`
        );

        if (!res.ok) return;

        const data = await res.json();
        if (!data || !data.status) return;

        if (cancelActive) return;

        if (data.status === "HELP_ON_WAY") {
          setEmergencyStatus("help");
          setHelperOnWay(data.helperName || "A helper");
        }

        if (data.status === "DANGER") {
          setEmergencyStatus("danger");
        }

        if (data.status === "SAFE") {
          setEmergencyStatus("safe");
          setHelperOnWay("");
        }
      } catch (err) {
        console.error("SOS status fetch error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [cancelActive]);

  // ---------------- HELPER RESPONSE POLLING ----------------
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://helpmate-production.up.railway.app/api/sos-responses-list?userEmail=${user.email}`
        );

        if (!res.ok) return;

        const data = await res.json();

        data.forEach((r) => {
          const key = r.helper_email + r.created_at;

          if (!seenResponses.has(key)) {
            addAlert(
              `🙋 ${r.helper_name} (${r.helper_email}) responded: ${r.response.toUpperCase()}`
            );

            setSeenResponses((prev) => new Set(prev).add(key));
          }
        });
      } catch (err) {
        console.error("Response polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [seenResponses]);

  // ---------------- SOS HOLD BUTTON ----------------
  const startHold = () => {
    if (holding) return;
    setHolding(true);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / 3000) * 100, 100);
      setProgress(percent);

      if (elapsed >= 3000) {
        clearInterval(timerRef.current);
        setHolding(false);
        setShowTypeModal(true);
      }
    }, 50);
  };

  const stopHold = () => {
    clearInterval(timerRef.current);
    setHolding(false);
    setProgress(0);
  };

  // ---------------- TYPE SELECTION ----------------
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowTypeModal(false);

    setEmergencyStatus("danger");
    addAlert(`🚨 SOS Activated: ${type}`);

    setCancelActive(true);
    setCancelTime(10);

    let timeLeft = 10;
    countdownRef.current = setInterval(() => {
      timeLeft--;
      setCancelTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(countdownRef.current);
        setCancelActive(false);
        triggerSOS(type);
      }
    }, 1000);
  };

  // ---------------- SEND SOS EMAIL ----------------
const triggerSOS = async (type) => {
  setEmergencyStatus("danger");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  if (!user.email) return;

  const sendSOSWithLocation = async (coords) => {
    const location = coords
      ? { latitude: coords.latitude, longitude: coords.longitude }
      : null;

    try {
      // 1️⃣ Get emergency contacts
      const res = await fetch(
        `https://helpmate-production.up.railway.app/api/emergency-contacts?email=${user.email}`
      );

      if (!res.ok) throw new Error("Failed to fetch contacts");

      const contacts = await res.json();

      // 2️⃣ Call SOS API (backend now responds immediately)
      const sosRes = await fetch("https://helpmate-production.up.railway.app/api/send-sos-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          contacts,
          alertType: type,
          location,
        }),
      });

      if (!sosRes.ok) throw new Error("SOS API failed");

      // 3️⃣ Show success INSTANTLY (no waiting for emails)
      addAlert("✅ SOS Alert Sent Successfully!");
      setShowSuccessModal(true);

    } catch (err) {
      console.error("❌ Failed to send SOS:", err);
      alert("Failed to send SOS. Please try again.");
    }
  };

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      await sendSOSWithLocation(position.coords);
    },
    async () => {
      // If location fails, still send SOS
      await sendSOSWithLocation(null);
    },
    { enableHighAccuracy: true }
  );
};


  // ---------------- CANCEL SOS ----------------
  const cancelSOS = () => {
    clearInterval(countdownRef.current);
    setCancelActive(false);
    setShowCancelModal(true);
  };

  const confirmCancelEmergency = (reason) => {
    clearInterval(countdownRef.current);
    setEmergencyStatus("safe");
    setHelperOnWay("");
    addAlert(`❌ SOS Cancelled: ${reason}`);
    setShowCancelModal(false);
    setShowSuccessModal(false);
  };

  // ---------------- HELPLINE ----------------
  const handleHelpline = (number = "112") => {
    addAlert(`📞 Called Emergency Helpline ${number}`);
    window.open(`tel:${number}`);
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleString();

  return (
    <div className="home">
      <div className={`status-box ${emergencyStatus}`}>
        <div>
          <p className="status-label">Emergency Status</p>

          {/* ✅ SAFE */}
          {emergencyStatus === "safe" && (
            <div className="status-pill safe">
              <MdShield /> SAFE
            </div>
          )}

          {/* 🔴 DANGER */}
          {emergencyStatus === "danger" && (
            <div className="status-pill danger">
              <MdWarning /> IN DANGER
            </div>
          )}

          {/* 🚑 HELP ON THE WAY */}
          {emergencyStatus === "help" && (
            <div className="status-pill help">
               {helperOnWay} is on the way
            </div>
          )}
        </div>

        <div className={`status-icon ${emergencyStatus}`}>
          {emergencyStatus === "safe" ? <MdShield /> : <MdWarning />}
        </div>
      </div>

      <div className="emergency-section">
        <h2>One-Click Emergency</h2>

        <div
          className={`emergency-button ${holding ? "holding" : ""}`}
          onMouseDown={startHold}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={startHold}
          onTouchEnd={stopHold}
        >
          <svg className="progress-ring" width="200" height="200">
            <circle cx="100" cy="100" r="90" className="progress-bg" />
            <circle
              cx="100"
              cy="100"
              r="90"
              className="progress-bar"
              style={{
                strokeDashoffset: 565 - (565 * progress) / 100,
              }}
            />
          </svg>

          <div className="btn-content">
            <MdWarning />
            <p>{progress >= 100 ? "SOS READY" : "HOLD 3 SEC"}</p>
          </div>
        </div>

        <p className="hint-text">
          Press and hold for 3 seconds to activate
        </p>
      </div>

      {cancelActive && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2>Sending SOS Alert</h2>
            <h3>Your alert will be sent in</h3>

            <div className="success-pill" style={{ textAlign: "center" }}>
              ⏳ {cancelTime} seconds
            </div>

            <div className="popup-actions" style={{ marginTop: "18px" }}>
              <button className="modal-btn btn-cancel" onClick={cancelSOS}>
                ❌ Cancel SOS
              </button>

              <button className="modal-btn" disabled>
                Sending...
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="helpline-banner" onClick={() => handleHelpline("112")}>
        <div>
          <p>24/7 Toll-Free Helpline</p>
          <h2>112</h2>
        </div>
        <div className="call-circle">
          <MdPhone />
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Updates</h3>
        {alerts.map((alert) => (
          <div className="alert-card" key={alert.id}>
            <MdInfo className="alert-icon blue" />
            <div>
              <h4>{alert.message}</h4>
              <span>{formatTime(alert.time)}</span>
            </div>
          </div>
        ))}
      </div>

      {showTypeModal && (
        <EmergencyTypeModal
          onSelect={handleTypeSelect}
          onCancel={() => setShowTypeModal(false)}
        />
      )}

      {showSuccessModal && (
        <EmergencySuccessModal
          type={selectedType}
          onCancel={() => setShowCancelModal(true)}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {showCancelModal && (
        <CancelEmergencyModal
          onConfirm={confirmCancelEmergency}
          onBack={() => setShowCancelModal(false)}
        />
      )}
    </div>
  );
}
