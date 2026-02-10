import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/nearbyhelp.css";

/* ===============================
   LEAFLET DEFAULT ICON FIX
=============================== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* 🔴 USER LOCATION ICON */
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* 🔵 EMERGENCY SERVICE ICON */
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ===============================
   MAP RECENTER
=============================== */
function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) map.setView([lat, lon], 14);
  }, [lat, lon, map]);
  return null;
}

/* ===============================
   DISTANCE CALCULATION
=============================== */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* ===============================
   EMERGENCY CATEGORIES
=============================== */
const categories = [
  { key: "police station", title: "Police", emoji: "🚓" },
  { key: "fire station", title: "Fire Station", emoji: "🚒" },
  { key: "hospital", title: "Hospital", emoji: "🏥" },
  { key: "clinic", title: "Clinic", emoji: "🏥" },
  { key: "pharmacy", title: "Pharmacy", emoji: "💊" },
  { key: "ambulance", title: "Ambulance", emoji: "🚑" },
  { key: "blood bank", title: "Blood Bank", emoji: "🩸" },
  { key: "veterinary hospital", title: "Veterinary", emoji: "🐶" },
  { key: "dental clinic", title: "Dental", emoji: "🦷" },
  { key: "psychiatrist", title: "Mental Health", emoji: "🧠" },
  { key: "diagnostic center", title: "Diagnostic Lab", emoji: "🧪" },
  { key: "maternity hospital", title: "Maternity", emoji: "👶" },
];

export default function NearbyHelpPage() {
  const [location, setLocation] = useState(null);
  const [groupedPlaces, setGroupedPlaces] = useState({});
  const [loading, setLoading] = useState(false);

  /* ===============================
     GET USER LOCATION
  =============================== */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      () => alert("Location access denied")
    );
  }, []);

  /* ===============================
     FETCH NEARBY HELP (ENGLISH)
  =============================== */
  const fetchNearbyHelp = async () => {
    if (!location) return;
    setLoading(true);

    let grouped = {};

    try {
      for (const cat of categories) {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              format: "json",
              q: cat.key,
              limit: 6,
              viewbox: `${location.lon - 0.05},${location.lat + 0.05},
                        ${location.lon + 0.05},${location.lat - 0.05}`,
              bounded: 1,
              "accept-language": "en", // ✅ FORCE ENGLISH
            },
            headers: {
              "Accept-Language": "en", // ✅ EXTRA SAFETY
            },
          }
        );

        grouped[cat.title] = res.data
          .map((p) => ({
            ...p,
            emoji: cat.emoji,
            distance: getDistance(
              location.lat,
              location.lon,
              parseFloat(p.lat),
              parseFloat(p.lon)
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);
      }

      setGroupedPlaces(grouped);
    } catch (err) {
      alert("Failed to load nearby emergency services");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="helpline-page">
      <div className="contact-card">
        <h2>🚨 Nearby Emergency Help</h2>

        {location && (
          <MapContainer
            center={[location.lat, location.lon]}
            zoom={14}
            className="map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <RecenterMap lat={location.lat} lon={location.lon} />

            {/* 🔴 USER LOCATION */}
            <Marker position={[location.lat, location.lon]} icon={redIcon}>
              <Popup>📍 Your Location</Popup>
            </Marker>

            {/* 🔵 EMERGENCY SERVICES */}
            {Object.values(groupedPlaces).flat().map((place) => (
              <Marker
                key={`${place.osm_id}-${place.lat}`}
                position={[place.lat, place.lon]}
                icon={blueIcon}
              >
                <Popup>
                  {place.emoji}{" "}
                  <strong>{place.name || place.display_name}</strong>
                  <br />
                  📍 {place.distance.toFixed(2)} km away
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        <button className="find-btn" onClick={fetchNearbyHelp}>
          {loading ? "Searching..." : "Find Nearby Help"}
        </button>

        {/* CATEGORY BOXES */}
        <div className="emergency-grid">
          {categories.map((cat) => (
            <div className="emergency-category" key={cat.title}>
              <div className="emergency-category-header">
                <span>{cat.emoji}</span> {cat.title}
              </div>

              {(groupedPlaces[cat.title] || []).map((p) => (
                <div className="emergency-place" key={p.osm_id}>
                  <div className="emergency-place-name">
                    {p.name || p.display_name}
                  </div>
                  <div className="emergency-place-info">
                    📍 {p.distance.toFixed(2)} km away
                  </div>
                </div>
              ))}

              {(groupedPlaces[cat.title] || []).length === 0 && (
                <div className="emergency-place-info">
                  No nearby services found
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}