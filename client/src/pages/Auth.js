import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UseAnimations from "react-useanimations";
import visibility from "react-useanimations/lib/visibility";
import Lottie from "lottie-react";
import { toast } from "react-toastify"; 

import otpAnimation from "../assets/otp.json";
import googleIcon from "../assets/google.png";
import "./Auth.css";

const Auth = ({ setUser }) => {
  const navigate = useNavigate();
  const otpTimerRef = useRef(null);

  const [isLogin, setIsLogin] = useState(true);
  const [showOtpAnimation, setShowOtpAnimation] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSignupChange = (e) =>
    setSignupData({ ...signupData, [e.target.name]: e.target.value });

  /* ---------- LOGIN ---------- */
  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast.warning("Please fill all fields ⚠️");
      return;
    }

    try {
      const res = await fetch("https://helpmate-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userName", data.user.full_name);
      localStorage.setItem("userPhone", data.user.phone);

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!");
      navigate("/location-permission");
    } catch (err) {
      toast.error("Server error");
    }
  };

  /* ---------- SIGNUP ---------- */
  const handleSignup = async () => {
    const { full_name, email, phone, password } = signupData;

    if (!full_name || !email || !phone || !password) {
      toast.warning("Please fill all fields ⚠️");
      return;
    }

    setShowOtpAnimation(true);

    try {
      const res = await fetch("https://helpmate-production.up.railway.app/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (!res.ok) {
        setShowOtpAnimation(false);
        toast.error(data.message || "Signup failed");
        return;
      }

      toast.success("OTP sent to your email 📧");
      localStorage.setItem("signupData", JSON.stringify(signupData));
      localStorage.setItem("userEmail", email);

      setUser(signupData);
      localStorage.setItem("user", JSON.stringify(signupData));

      // ✅ OTP animation only 600ms
      otpTimerRef.current = setTimeout(() => {
        setShowOtpAnimation(false);
        navigate("/verify-otp");
      }, 600);
    } catch (err) {
      if (otpTimerRef.current) clearTimeout(otpTimerRef.current);
      setShowOtpAnimation(false);
      toast.error("Server error");
    }
  };

  if (showOtpAnimation) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#ffffff",
        }}
      >
        <Lottie
          animationData={otpAnimation}
          loop={false}
          speed={2}
          style={{ width: 240, height: 240 }}
        />
        <h2 style={{ marginTop: "12px", fontWeight: 900 }}>
          Sending OTP…
        </h2>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className={`auth-box ${isLogin ? "" : "active"}`}>
        {/* LOGIN */}
        <div className="form-container login">
          <h2>Sign in to your Account</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleLoginChange}
          />
          <div style={{ position: "relative" }}>
            <input
              type={showLoginPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              style={{ paddingRight: "45px" }}
            />
            <div
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowLoginPass(!showLoginPass)}
            >
              <UseAnimations
                animation={visibility}
                size={26}
                autoplay={false}
                reverse={showLoginPass}
              />
            </div>
          </div>
          <button className="primary-btn" onClick={handleLogin}>
            LOGIN
          </button>
          <button className="google-btn">
            <img src={googleIcon} alt="Google" />
            Continue with Google
          </button>
        </div>

        {/* SIGNUP */}
        <div className="form-container register">
          <h2>Sign up to your Account</h2>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={signupData.full_name}
            onChange={handleSignupChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signupData.email}
            onChange={handleSignupChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={signupData.phone}
            onChange={handleSignupChange}
          />
          <div style={{ position: "relative" }}>
            <input
              type={showSignupPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              style={{ paddingRight: "45px" }}
            />
            <div
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowSignupPass(!showSignupPass)}
            >
              <UseAnimations
                animation={visibility}
                size={26}
                autoplay={false}
                reverse={showSignupPass}
              />
            </div>
          </div>
          <button className="primary-btn" onClick={handleSignup}>
            SIGN UP
          </button>
          <button className="google-btn">
            <img src={googleIcon} alt="Google" />
            Continue with Google
          </button>
        </div>

        {/* OVERLAY */}
        <div className="overlay">
          <div className="overlay-panel left">
            <h2>Already Registered?</h2>
            <p>Login with your personal info</p>
            <button className="ghost" onClick={() => setIsLogin(true)}>
              LOGIN
            </button>
          </div>
          <div className="overlay-panel right">
            <h2>New Here?</h2>
            <p>Enter your details and start your journey</p>
            <button className="ghost" onClick={() => setIsLogin(false)}>
              REGISTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;