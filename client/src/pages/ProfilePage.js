import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import { addAlert } from "../utils/recentAlerts";
import "../styles/profile.css";

const fallbackProfile = {
  full_name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  country: "India",
  state: "Karnataka",
  city: "Bangalore",
  pincode: "560001",
  profile_image: "",
};

const ProfilePage = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [photoFile, setPhotoFile] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [profile, setProfile] = useState(fallbackProfile);
  const [profileLoaded, setProfileLoaded] = useState(false);

  /* ======================================================
     🔒 SESSION GUARD (ADDED)
     ====================================================== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  /* ======================================================
     ✅ Fetch Profile Data (UNCHANGED)
     ====================================================== */
  useEffect(() => {
    if (profileLoaded) return;

    const fetchProfile = async () => {
      try {
        const currentUser =
          user || JSON.parse(localStorage.getItem("user")) || fallbackProfile;

        setCountries(Country.getAllCountries() || []);

        const res = await axios.get(
          `https://helpmate-production.up.railway.app/auth/me?email=${currentUser.email}`
        );

        const data = res.data || {};

        const finalProfile = {
          full_name: data.full_name || currentUser.full_name,
          email: data.email || currentUser.email,
          phone: data.phone || "",
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          pincode: data.pincode || "",
          profile_image: data.profile_image || "",
        };

        setProfile(finalProfile);
        setUser(finalProfile);
        setProfileLoaded(true);

        const countryObj = Country.getAllCountries().find(
          (c) => c.name === finalProfile.country
        );

        if (countryObj) {
          const statesList = State.getStatesOfCountry(countryObj.isoCode) || [];
          setStates(statesList);

          const stateObj = statesList.find(
            (s) => s.name === finalProfile.state
          );

          if (stateObj) {
            setCities(
              City.getCitiesOfState(
                countryObj.isoCode,
                stateObj.isoCode
              ).map((c) => c.name)
            );
          }
        }
      } catch {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [user, setUser, profileLoaded]);

  /* ---------------- Handlers (UNCHANGED) ---------------- */

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const countryObj = countries.find((c) => c.name === countryName);

    const statesList = countryObj
      ? State.getStatesOfCountry(countryObj.isoCode)
      : [];

    setStates(statesList);
    setCities([]);

    setProfile((prev) => ({
      ...prev,
      country: countryName,
      state: "",
      city: "",
      pincode: "",
    }));
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    const countryObj = countries.find((c) => c.name === profile.country);
    const stateObj = states.find((s) => s.name === stateName);

    if (!countryObj || !stateObj) return;

    const citiesList =
      City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode) || [];

    setCities(citiesList.map((c) => c.name));

    setProfile((prev) => ({
      ...prev,
      state: stateName,
      city: "",
      pincode: "",
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);

    setProfile((prev) => ({
      ...prev,
      profile_image: URL.createObjectURL(file),
    }));
  };

  const handlePhotoSave = async () => {
    if (!photoFile) return;

    const formData = new FormData();
    formData.append("profileImage", photoFile);

    try {
      const res = await axios.post(
        `https://helpmate-production.up.railway.app/profile/upload/${profile.email}`,
        formData
      );

      const imagePath = res.data.profile_image || "";

      setProfile((prev) => ({ ...prev, profile_image: imagePath }));
      setUser((prev) => ({ ...prev, profile_image: imagePath }));

      toast.success("Profile photo updated");
      setPhotoFile(null);
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`https://helpmate-production.up.railway.app/profile/${profile.email}`, profile);

      localStorage.setItem("user", JSON.stringify(profile));
      setUser(profile);

      addAlert("Profile updated");
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  /* ======================================================
     🚪 LOGOUT FIX (ONLY CHANGE HERE)
     ====================================================== */
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);

    toast.success("Logged out");

    setTimeout(() => {
      navigate("/auth", { replace: true });
    }, 500);
  };

  /* ---------------- UI (UNCHANGED) ---------------- */

  return (
    <div className="profile-layout">
      <Toaster position="top-center" />

      <div className="profile-container">
        <h2>Profile</h2>

        <div className="avatar-wrapper">
          <div className="avatar">
            {profile.profile_image ? (
              <img
                src={
                  profile.profile_image.startsWith("http")
                    ? profile.profile_image
                    : `https://helpmate-production.up.railway.app${profile.profile_image}`
                }
                alt="profile"
              />
            ) : (
              profile.full_name?.charAt(0) || "U"
            )}
          </div>

          <label className="avatar-edit">
            ✎
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </label>
        </div>

        {photoFile && (
          <button onClick={handlePhotoSave} className="save-photo">
            Save Photo
          </button>
        )}

        <div className="profile-form">
          <label>Full Name</label>
          <input
            value={profile.full_name}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
          />

          <label>Email</label>
          <input value={profile.email} readOnly />

          <label>Phone</label>
          <input
            value={profile.phone}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
          />

          <div className="two-column">
            <div>
              <label>Country</label>
              <select value={profile.country} onChange={handleCountryChange}>
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.isoCode} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>State</label>
              <select value={profile.state} onChange={handleStateChange}>
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>City</label>
              <select
                value={profile.city}
                onChange={(e) =>
                  setProfile({ ...profile, city: e.target.value })
                }
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Pincode</label>
              <input
                value={profile.pincode}
                onChange={(e) =>
                  setProfile({ ...profile, pincode: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>

          <div className="right-buttons">
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-secondary"
            >
              Back
            </button>

            <button onClick={handleSaveProfile} className="btn-primary">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;