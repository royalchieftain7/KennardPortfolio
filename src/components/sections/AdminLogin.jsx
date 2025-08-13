import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PinInput from "./PinInput";
import emailjs from "emailjs-com";

const ADMIN_EMAIL = "kennardodavinci@gmail.com";

function generatePin(length = 6) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

// Cache key and duration (3 days in ms)
const ADMIN_CACHE_KEY = "admin_logged_in";
const ADMIN_CACHE_DURATION = 3 * 24 * 60 * 60 * 1000;

const AdminLogin = ({ onLogin }) => {
  const [step, setStep] = useState(1); // 1: email, 2: pin
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [sentPin, setSentPin] = useState("");
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeMessage, setCodeMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(ADMIN_CACHE_KEY);
    if (cached) {
      try {
        const { ts } = JSON.parse(cached);
        if (Date.now() - ts < ADMIN_CACHE_DURATION) {
          navigate("/admin/dashboard");
        } else {
          localStorage.removeItem(ADMIN_CACHE_KEY);
        }
      } catch {
        localStorage.removeItem(ADMIN_CACHE_KEY);
      }
    }
  }, [navigate]);

  // Send PIN using EmailJS
  const handleSendPin = async () => {
    setError("");
    setLoading(true);
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError("Email not recognized");
      setLoading(false);
      return;
    }
    // Generate a random 6-digit PIN
    const generatedPin = generatePin(6);
    setSentPin(generatedPin);

    // EmailJS config
    const serviceID = "service_ly4egvl";
    const templateID = "template_7kbn8hv";
    const userID = "p8PvgIAF2Xo_x13As";

    try {
      await emailjs.send(
        serviceID,
        templateID,
        { to_email: email, pin: generatedPin },
        userID
      );
      setCodeSent(true);
      setCodeMessage("A 6-digit PIN has been sent to your email.");
      setStep(2);
    } catch (err) {
      setError("Failed to send PIN. Please try again.");
    }
    setLoading(false);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (pin.length !== 6) {
      setError("Please enter the 6-digit PIN.");
      return;
    }
    if (pin === sentPin) {
      // Set cache with timestamp
      localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify({ ts: Date.now() }));
      navigate("/admin/dashboard");
      onLogin && onLogin();
    } else {
      setError("Incorrect PIN.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--body-background)",
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <form
        onSubmit={step === 2 ? handlePinSubmit : e => e.preventDefault()}
        style={{
          background: "#191919",
          padding: "2.5rem 2rem",
          borderRadius: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
          minWidth: "320px",
          color: "var(--main-color)",
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        <h2
          style={{
            marginBottom: "1.5rem",
            color: "var(--primary-color)",
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            letterSpacing: "1px",
            textAlign: "center",
          }}
        >
          Admin Login
        </h2>
        {error && (
          <div
            style={{
              color: "#ff4d4f",
              marginBottom: "1rem",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}
        {step === 1 && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <input
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "#232323",
                  color: "var(--main-color)",
                  fontSize: "1rem",
                  fontFamily: '"DM Sans", sans-serif',
                  marginBottom: "0.5rem",
                }}
                autoFocus
                disabled={codeSent || loading}
              />
            </div>
            <button
              type="button"
              onClick={handleSendPin}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "50px",
                border: "none",
                background: "var(--primary-color)",
                color: "#070707",
                fontWeight: 600,
                fontSize: "1rem",
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: "1px",
                cursor: "pointer",
                transition: "background 0.3s",
                marginBottom: "1rem",
                opacity: loading ? 0.7 : 1,
              }}
              disabled={codeSent || loading}
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
            {codeMessage && (
              <div
                style={{
                  color: "var(--primary-color)",
                  marginBottom: "1rem",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {codeMessage}
              </div>
            )}
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <PinInput
                value={pin}
                onChange={setPin}
                length={6}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "50px",
                border: "none",
                background: "var(--primary-color)",
                color: "#070707",
                fontWeight: 600,
                fontSize: "1rem",
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: "1px",
                cursor: "pointer",
                transition: "background 0.3s",
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
            {/* For demo: show the PIN on screen */}
            {sentPin && (
              <div
                style={{
                  color: "var(--primary-color)",
                  marginTop: "1rem",
                  textAlign: "center",
                  fontWeight: 500,
                  fontSize: "0.9rem"
                }}
              >
                <span style={{ opacity: 0.5 }}>(Demo PIN: {sentPin})</span>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;