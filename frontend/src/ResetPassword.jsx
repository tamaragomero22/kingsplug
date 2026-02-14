import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import "./ResetPassword.css";

const API_URL = import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === 'kingsplug.com' || window.location.hostname === 'www.kingsplug.com'
        ? 'https://api.kingsplug.com'
        : 'http://localhost:4000');

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token || !email) {
            setError("Invalid reset link. Please request a new one.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
                email,
                token,
                newPassword
            });

            if (response.data.success) {
                setSuccess("Password reset successfully! Redirecting to login...");
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password. The link may have expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Nav />
            <div className="reset-password-container">
                <div className="reset-password-card fade-up visible">
                    <h2>Reset Password</h2>
                    <p className="subtitle">Enter your new password below</p>

                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-box">{error}</div>}
                        {success && <div className="success-box">{success}</div>}

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <button type="submit" className="cta-button" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ResetPassword;
