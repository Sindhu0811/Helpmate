import React from "react";
import {
  MdHome,
  MdPhoneInTalk,
  MdMedicalServices,
  MdContacts,
  MdHistory,
  MdSettings,
  MdHelp,
  MdLocationOn,   // 👈 add this
} from "react-icons/md";

import "../styles/dashboard.css";
import logo from "../assets/logo1.png";

export default function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { name: "Home", icon: <MdHome /> },
    { name: "Helpline", icon: <MdPhoneInTalk /> },
    { name: "Nearby Help", icon: <MdLocationOn /> }, // 👈 added here
    { name: "Quick Aid", icon: <MdMedicalServices /> },
    { name: "My Contacts", icon: <MdContacts /> },
    { name: "Alert History", icon: <MdHistory /> },
    { name: "Settings", icon: <MdSettings /> },
    { name: "FAQ", icon: <MdHelp /> },
  ];

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="sidebar-logo">
        <img src={logo} alt="Helpmate" />
        <span>Helpmate</span>
      </div>

      {/* MENU */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`sidebar-item ${
              activePage === item.name ? "active" : ""
            }`}
            onClick={() => setActivePage(item.name)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}