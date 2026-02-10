import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import locationIcon from "../assets/location.png";
import "./LocationPermission.css";

const LocationPermission = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState(null);

  const handleAllowLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("⚠️ Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        setLocation(coords);
        localStorage.setItem("userLocation", JSON.stringify(coords));
        localStorage.setItem("locationAllowed", "true");

        // Optional: send to server
        fetch("http://localhost:5000/update-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coords),
        }).catch(console.error);

        // Navigate only after location is allowed
        navigate("/dashboard", { replace: true });
      },
      (err) => {
        setErrorMessage(
          "⚠️ Location access denied. Please enable location permission to continue."
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );
  };

  const handleMaybeLater = () => {
    setErrorMessage("⚠️ HelpMate requires location access to continue.");
  };

  return (
    <div className="lp-container">
      {errorMessage && <div className="lp-top-alert">{errorMessage}</div>}

      <div className="lp-card">
        <img src={locationIcon} alt="Location Icon" className="lp-icon" />
        <h2 className="lp-title">Allow your location</h2>
        <p className="lp-subtitle">
          We'll use your location to recommend local groups and people relevant to you.
        </p>

        {!location && (
          <>
            <button className="lp-allow-btn" onClick={handleAllowLocation}>
              ALLOW LOCATION
            </button>
            <button className="lp-maybe-btn" onClick={handleMaybeLater}>
              MAYBE LATER
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LocationPermission;