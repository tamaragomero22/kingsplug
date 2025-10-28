import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");

  useEffect(() => {
    if (!userId) {
      setError("User not found. Please try registering again.");
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ userId, otp }),
        headers: { "Content-Type": "application/json" },
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
        // Pass user data to the dashboard to avoid a race condition on data fetching.
        // The dashboard can use this data immediately without having to fetch it.
        const user = {
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          isKycVerified: data.user.isKycVerified,
        };
        navigate("/dashboard", { state: { user } });
      }, 3000);
    } catch (err) {
      setError(err.message);
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
          An OTP has been sent to your email address. Please enter it below.
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

        <Link className="forgotPassword" style={{ marginTop: "2rem" }} to="/">
          Back to Log In
        </Link>
      </form>
      <Footer />
    </>
  );
};

export default VerifyEmail;
