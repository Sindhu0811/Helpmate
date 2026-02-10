import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./OtpVerify.css";
import otpImg from "../assets/otp.png";
import { toast } from "react-toastify";

const OtpVerify = ({ setUser }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const signupData = JSON.parse(localStorage.getItem("signupData"));

  const handleChange = (e, i) => {
    if (!/^\d?$/.test(e.target.value)) return;
    const newOtp = [...otp];
    newOtp[i] = e.target.value;
    setOtp(newOtp);
    if (e.target.value && i < 5) inputRefs.current[i + 1].focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    paste.split("").forEach((char, idx) => {
      if (/^\d$/.test(char)) newOtp[idx] = char;
    });
    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...signupData, otp: enteredOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Email verified successfully");

      localStorage.removeItem("signupData");

      // Save user to localStorage and state
      localStorage.setItem("user", JSON.stringify(signupData));
      setUser(signupData);

      setTimeout(() => navigate("/location-permission"), 800);
    } catch (error) {
      toast.error("Server error. Try again later");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("OTP resent to your email 📩");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    } catch (error) {
      toast.error("Server error. Try again later");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <img src={otpImg} alt="OTP" className="otp-img" />
        <h2>Verify Your Email Address</h2>
        <p className="otp-desc">Enter the 6-digit code sent to your email</p>

        <div className="otp-inputs">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={value}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        <button className="verify-btn" onClick={handleSubmit}>
          Verify Email
        </button>

        <p className="resend-text" onClick={handleResendOtp}>
          Resend Code
        </p>
      </div>
    </div>
  );
};

export default OtpVerify;