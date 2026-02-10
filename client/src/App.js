import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------- PAGES ---------- */
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import OtpVerify from "./pages/OtpVerify";
import LocationPermission from "./pages/LocationPermission";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import NearbyHelpPage from "./pages/NearbyHelpPage";
import HelplinePage from "./pages/HelplinePage";
import QuickAidPage from "./pages/QuickAidPage";
import ContactsPage from "./pages/ContactsPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);

  const isLocationAllowed = Boolean(
    localStorage.getItem("locationAllowed")
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        transition={Slide}
        theme="colored"
      />

      <Routes>
        <Route
          path="/"
          element={showSplash ? <Splash /> : <Navigate to="/auth" replace />}
        />

        <Route path="/auth" element={<Auth setUser={setUser} />} />
        <Route path="/verify-otp" element={<OtpVerify setUser={setUser} />} />

        <Route
          path="/location-permission"
          element={user ? <LocationPermission /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/dashboard"
          element={
            user && isLocationAllowed ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/location-permission" replace />
            )
          }
        />

        <Route
          path="/helpline"
          element={
            user && isLocationAllowed ? (
              <HelplinePage />
            ) : (
              <Navigate to="/location-permission" replace />
            )
          }
        />

        <Route
          path="/quick-aid"
          element={
            user && isLocationAllowed ? (
              <QuickAidPage />
            ) : (
              <Navigate to="/location-permission" replace />
            )
          }
        />

        <Route
          path="/nearby-help"
          element={
            user && isLocationAllowed ? (
              <NearbyHelpPage />
            ) : (
              <Navigate to="/location-permission" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <ProfilePage user={user} setUser={setUser} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        <Route
          path="/contacts"
          element={user ? <ContactsPage /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/history"
          element={user ? <HistoryPage /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/auth"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
