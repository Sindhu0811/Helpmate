import React, { useEffect, useState } from "react";
import { subscribeAlerts, clearAlerts } from "../utils/recentAlerts";
import "../styles/history.css";

export default function HistoryPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeAlerts((data) => {
      // ✅ FILTER ONLY SOS-RELATED ALERTS
      const sosAlerts = data.filter((alert) => {
        const msg = alert.message || "";

        return (
          msg.includes("SOS") ||
          msg.includes("Emergency Cancelled") ||
          msg.includes("alert sent")
        );
      });

      setAlerts(sosAlerts);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2>📜 SOS History</h2>

          {alerts.length > 0 && (
            <button className="clear-btn" onClick={clearAlerts}>
              Clear History
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <p style={{ color: "#6b7280" }}>
            No SOS activity yet.
          </p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="card-row">
              <div className="card-left">
                <div className="card-avatar">🚨</div>

                <div className="card-info">
                  <h4>{alert.message}</h4>
                  <p>
                    {new Date(alert.time).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}