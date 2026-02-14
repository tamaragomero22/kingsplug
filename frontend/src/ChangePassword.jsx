import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import "./ChangePassword.css";

const API_URL = import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === 'kingsplug.com' || window.location.hostname === 'www.kingsplug.com'
        ? 'https://api.kingsplug.com'
        : 'http://localhost:4000');

const ChangePassword = () => {
    const [userEmail, setUserEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetchingUser, setIsFetchingUser] = useState(true);
    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/dashboard/data`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                navigate("/");
                return;
            }

            const data = await response.json();
            setUserEmail(data.user.email);
            setFirstName(data.user.firstName);
        } catch (error) {
            console.error("Failed to fetch user data:", error.message);
            navigate("/");
        } finally {
            setIsFetchingUser(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/change-password`,
                { currentPassword, newPassword },
                { withCredentials: true }
            );

            if (response.data.success) {
                setSuccess("Password updated successfully! Redirecting...");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message ||
                err.response?.data?.errors?.password ||
                err.response?.data?.error ||
                "Failed to update password";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (isFetchingUser) {
        return <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "hsl(215, 33%, 5%)", color: "#fff" }}>Loading...</div>;
    }

    return (
        <>
            <Nav
                userEmail={userEmail}
                firstName={firstName}
                onLogout={handleLogout}
                logoLinkTo="/dashboard"
            />
            <div className="change-password-container">
                <div className="change-password-card fade-up visible">
                    <h2>Change Password</h2>
                    <p className="subtitle">Update your account security</p>

                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-box">{error}</div>}
                        {success && <div className="success-box">{success}</div>}

                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                required
                            />
                        </div>

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
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                        <button type="button" onClick={() => navigate("/dashboard")} className="cancel-btn">
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ChangePassword;
