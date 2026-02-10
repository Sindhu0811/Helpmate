// src/utils/recentAlerts.js

// ✅ Load alerts from LocalStorage (History)
let alerts = JSON.parse(localStorage.getItem("alerts")) || [];

let listeners = [];

const MAX_ALERTS = 20;

export const addAlert = (message) => {
  const now = Date.now();

  // ❌ Block duplicates within 2 seconds
  const duplicate = alerts.some(
    (a) => a.message === message && now - a.time < 2000
  );
  if (duplicate) return;

  const newAlert = {
    id: now,
    message,
    time: now,
  };

  // ✅ Always add to TOP
  alerts = [newAlert, ...alerts].slice(0, MAX_ALERTS);

  // ✅ Save to LocalStorage (History Storage)
  localStorage.setItem("alerts", JSON.stringify(alerts));

  // 🔔 Notify subscribers
  listeners.forEach((cb) => cb([...alerts]));
};

export const subscribeAlerts = (callback) => {
  listeners.push(callback);

  // ✅ Send current alerts immediately
  callback([...alerts]);

  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
};

// ✅ Clear Full History (For History Page Button)
export const clearAlerts = () => {
  alerts = [];
  localStorage.removeItem("alerts");

  listeners.forEach((cb) => cb([...alerts]));
};