import React, { useState } from "react";
import "../styles/EmergencyModal.css";

export default function CancelEmergencyModal({ onConfirm, onBack }) {
  const reasons = [
    "False alarm / Mistake",
    "Situation resolved",
    "Help no longer needed",
    "Other",
  ];

  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const handleConfirm = () => {
    if (!selectedReason) {
      alert("Please select a reason");
      return;
    }

    if (selectedReason === "Other" && !otherReason.trim()) {
      alert("Please enter the reason");
      return;
    }

    onConfirm(selectedReason === "Other" ? otherReason : selectedReason);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Cancel Emergency</h2>
        <p className="warning-text">Please select a reason for cancellation:</p>

        {reasons.map((reason) => (
          <button
            key={reason}
            className={`modal-btn ${selectedReason === reason ? "btn-danger" : ""}`}
            onClick={() => setSelectedReason(reason)}
          >
            {reason}
          </button>
        ))}

        {selectedReason === "Other" && (
          <input
            type="text"
            placeholder="Enter reason"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            className="other-reason-input"
          />
        )}

        <div className="modal-actions">
          <button className="modal-btn btn-cancel" onClick={onBack}>
            Go Back
          </button>
          <button className="modal-btn btn-danger" onClick={handleConfirm}>
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}