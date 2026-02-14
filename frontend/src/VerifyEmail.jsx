import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import "./VerifyEmail.css";

const API_URL = import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'kingsplug.com' || window.location.hostname === 'www.kingsplug.com'
    ? 'https://api.kingsplug.com'
    : 'http://localhost:4000');

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!userId) {
      setError("User not found. Please try registering again.");
    }
  }, [userId]);

  // Handle countdown timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    if (!canResend) return;

    setError("");
    setMessage("");
    setCanResend(false);

    try {
      const res = await fetch(`${API_URL}/api/auth/send-verify-otp`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to resend OTP.");
      }

      setMessage("A new OTP has been sent to your email.");
      setTimer(120); // Start 120 second cooldown
    } catch (err) {
      setError(err.message);
      setCanResend(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      console.log(`Attempting to verify OTP at: ${API_URL}/api/auth/verify-email`);
      const res = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        body: JSON.stringify({ userId, otp }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Failed to verify OTP. Please try again."
        );
      }

      setMessage(
        "Email verified successfully! Redirecting to your dashboard..."
      );
      setTimeout(() => {
        const user = {
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          isKycVerified: data.user.isKycVerified,
        };
        navigate("/dashboard", { state: { user } });
      }, 3000);
    } catch (err) {
      console.error("Verification error detail:", err);
      setError(`Connection Error: ${err.message}`);
    }
  };

  return (
    <>
      <Nav />
      <form className="verifyEmailForm" onSubmit={handleSubmit}>
        <h2>Verify Your Email</h2>
        <p
          style={{
            color: "#ccc",
            fontSize: "0.9rem",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          An OTP has been sent to {email ? <span style={{ color: "#fff", fontWeight: "bold" }}>{email}</span> : "your email address"}. Please enter it below.
        </p>

        <input
          type="text"
          name="otp"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="6"
          required
        />

        {error && (
          <div
            className="error"
            style={{ textAlign: "center", marginTop: "1rem" }}
          >
            {error}
          </div>
        )}
        {message && (
          <div
            style={{ color: "#80ffea", textAlign: "center", marginTop: "1rem" }}
          >
            {message}
          </div>
        )}

        <button type="submit">Verify Account</button>

        <div className="resend-container" style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p style={{ color: "#888fb1", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Don't see it? Please check your <strong>spam folder</strong>.
          </p>
          <p style={{ color: "#888fb1", fontSize: "0.9rem" }}>
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend}
              style={{
                background: "none",
                border: "none",
                color: canResend ? "#9580ff" : "#555",
                textDecoration: canResend ? "underline" : "none",
                cursor: canResend ? "pointer" : "not-allowed",
                fontWeight: "bold",
                padding: "0",
                fontSize: "0.9rem"
              }}
            >
              {canResend ? "Resend Code" : `Resend in ${timer}s`}
            </button>
          </p>
        </div>

        <Link className="forgotPassword" style={{ marginTop: "1rem" }} to="/">
          Back to Log In
        </Link>
      </form>
      <Footer />
    </>
  );
};

export default VerifyEmail;