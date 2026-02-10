import React from "react";
import "../styles/EmergencyModal.css";

export default function EmergencyTypeModal({ onSelect, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Select Emergency Type</h2>
        <h3>Choose the type of emergency</h3>

        <button
          className="modal-btn btn-medical"
          onClick={() => onSelect("Medical Emergency")}
        >
        
          <span className="text">Medical Emergency</span>
        </button>

        <button
          className="modal-btn btn-police"
          onClick={() => onSelect("Police Emergency")}
        >
          
          <span className="text">Police Emergency</span>
        </button>

        <button
          className="modal-btn btn-fire"
          onClick={() => onSelect("Fire Emergency")}
        >
         
          <span className="text">Fire Emergency</span>
        </button>

        <button
          className="modal-btn btn-other"
          onClick={() => onSelect("Other Emergency")}
        >
          
          <span className="text">Other Emergency</span>
        </button>

        <button className="modal-btn btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}