import React from "react";
import "../styles/EmergencyModal.css";

export default function EmergencySuccessModal({ type, onCancel, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Emergency Alert Sent</h2>
        <p>
          <strong>{type}</strong>
        </p>

        <p>📍 Your live location has been shared</p>
        <p>📞 Emergency services notified</p>
        <p>📧 Emergency contacts informed</p>

        <button className="modal-btn btn-danger" onClick={onCancel}>
          Cancel Emergency
        </button>

        <button className="modal-btn btn-cancel" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}