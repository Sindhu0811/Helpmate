import React from "react";
import "./Splash.css";
import logo from "../assets/logo.png";

const appName = "HELPMATE";

const Splash = () => {
  return (
    <div className="splash-container">
      <div className="splash-content">
        {/* LOGO */}
        <img src={logo} alt="HelpMate Logo" className="spin-logo" />

        {/* APP NAME */}
        <h1 className="app-name">
          {appName.split("").map((letter, index) => (
            <span
              key={index}
              className="doodle-letter"
              style={{ animationDelay: `${index * 0.18}s` }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* TAGLINE */}
        <p className="tagline">Where trust meets service</p>

        {/* LOADING DOTS */}
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="bottom-section">

        {/* Line 1 */}
        <p className="developed-by-line">Developed By</p>

        {/* Line 2 */}
        <p className="college-name">JSS POLYTECHNIC FOR WOMEN</p>

        {/* Line 3 */}
        <p className="developer-names">
          Ashwini U<span className="name-dot">·</span>Bhuvana H
          <span className="name-dot">·</span>Pavithra
          <span className="name-dot">·</span>Gagan Sindhu L
        </p>

      </div>
    </div>
  );
};

export default Splash;