import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/dashboard.css";

/* Pages */
import HomePage from "./HomePage";
import HelplinePage from "./HelplinePage";
import NearbyHelpPage from "./NearbyHelpPage";
import QuickAidPage from "./QuickAidPage";
import ContactPage from "./ContactsPage";
import HistoryPage from "./HistoryPage";
import SettingsPage from "./SettingsPage";
import FAQPage from "./FAQPage";

const Dashboard = ({ user, setUser }) => {
  const [activePage, setActivePage] = useState("Home");

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">

        {/* SIDEBAR */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
        />

        {/* MAIN */}
        <div className="main">
          <Topbar
            user={user}
            activePage={activePage}
          />

          <div className="content">
            {activePage === "Home" && <HomePage />}
            {activePage === "Helpline" && <HelplinePage />}
            {activePage === "Nearby Help" && <NearbyHelpPage />}
            {activePage === "Quick Aid" && <QuickAidPage />}
            {activePage === "My Contacts" && <ContactPage />}
            {activePage === "Alert History" && <HistoryPage />}
            {activePage === "Settings" && <SettingsPage />}
            {activePage === "FAQ" && <FAQPage />}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;