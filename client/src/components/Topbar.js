import { MdNotificationsNone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/profile.png";

export default function Topbar({ user, activePage }) {
  const navigate = useNavigate();

  /* ===============================
     PAGE NAME (FROM SIDEBAR STATE)
  =============================== */
  const pageName = activePage
    ? activePage.toUpperCase()
    : "DASHBOARD";

  /* ===============================
     USER NAME (MATCHES Auth.js)
  =============================== */
  const userName =
    user?.full_name ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";

  /* ===============================
     PROFILE IMAGE
  =============================== */
  const profileSrc = user?.profile_image
    ? user.profile_image.startsWith("http")
      ? user.profile_image
      : `https://helpmate-production.up.railway.app${user.profile_image}`
    : defaultProfile;

  return (
    <div className="topbar">
      <div className="topbar-text">
        <h4>
          Hi <span>{userName}</span>   !
        </h4>
        <p>
          You are on <strong>{pageName}</strong>
        </p>
      </div>

      <div className="topbar-right">
        <MdNotificationsNone className="bell" />
        <img
          src={profileSrc}
          alt="profile"
          className="profile"
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
}