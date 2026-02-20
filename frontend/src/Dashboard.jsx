import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Nav } from "./Nav";
import "./Dashboard.css"; // Import the new dashboard styles
import SendBitcoin from "./SendBitcoin";
import { Footer } from "./Footer";

const API_URL = import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'kingsplug.com' || window.location.hostname === 'www.kingsplug.com'
    ? 'https://api.kingsplug.com'
    : 'http://localhost:4000');

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isKycComplete, setIsKycComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [btcPrice, setBtcPrice] = useState(null);
  const [btcPriceLoading, setBtcPriceLoading] = useState(true);
  const [btcPriceError, setBtcPriceError] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // The browser will automatically send the 'jwt' cookie with cross-origin requests
      const response = await fetch(`${API_URL}/api/dashboard/data`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // This is crucial for sending cookies to a different domain
      });

      if (!response.ok) {
        // If auth middleware returns 401, or for other errors
        navigate("/");
        return;
      }

      const data = await response.json();
      setUserEmail(data.user.email);
      setFirstName(data.user.firstName);
      setIsKycComplete(data.user.isKycVerified);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error.message);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If user data is passed from the login/verify page, use it immediately.
    // This avoids a race condition where the page fetches data before auth is confirmed.
    if (location.state?.user) {
      setUserEmail(location.state.user.email);
      setFirstName(location.state.user.firstName);
      setIsKycComplete(location.state.user.isKycVerified);
      setIsLoading(false);
    } else {
      // Only fetch immediately if we didn't get user data from the navigation state.
      fetchDashboardData();
    }
  }, [location.state]);

  const fetchBtcPrice = async () => {
    setBtcPriceLoading(true);
    setBtcPriceError(false);
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,ngn"
      );
      if (!res.ok) throw new Error("CoinGecko API error");
      const data = await res.json();
      const usdToNgn = data.bitcoin.ngn / data.bitcoin.usd;
      setBtcPrice(Math.round(usdToNgn));
    } catch (err) {
      console.error("BTC price fetch error:", err);
      setBtcPriceError(true);
    } finally {
      setBtcPriceLoading(false);
    }
  };

  useEffect(() => {
    fetchBtcPrice();
    const interval = setInterval(fetchBtcPrice, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  // Effect for fade-up animation
  useEffect(() => {
    if (isLoading) {
      return; // Don't set up the observer until loading is complete
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );
    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect(); // Cleanup observer on component unmount
  }, [isLoading]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      // On successful logout, redirect to the homepage
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally handle logout errors, e.g., show a notification
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <>
      <Nav
        userEmail={userEmail}
        firstName={firstName}
        onLogout={handleLogout}
        logoLinkTo="/dashboard"
      />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
        </div>
        <div className="dashboard-content">
          <div className="feature-card fade-up">
            <h3>BTC Rate:</h3>
            <p>
              {btcPriceLoading
                ? "Loading..."
                : btcPriceError
                  ? "Error"
                  : `\u20A6${btcPrice.toLocaleString("en-NG")}`}
            </p>
          </div>

          <div className="feature-card fade-up">
            <h3>USDT Rate</h3>
            <p>&#8358;1,470</p>
          </div>

          <div className="feature-card fade-up">
            <h3>ETH Rate</h3>
            <p>&#8358;1,420</p>
          </div>

          <div className="feature-card fade-up">
            <h3>USDC Rate</h3>
            <p>&#8358;1,460</p>
          </div>
        </div>

        {!isKycComplete && (
          <div className="dashboard-actions">
            <button
              onClick={() => {
                alert(
                  "KYC completion is necessary! This enables us to verify every user of Kingsplug. Once you have completed KYC, you're protected from fraud and other financial crimes. After the completion, your wallet address shall be provided. Click the link in the dashboard to complete your KYC."
                );
              }}
              className="cta-button"
            >
              Convert to Naira
            </button>
            <Link to="/kyc" className="kyc-link">
              Complete my KYC
            </Link>
          </div>
        )}

        {isKycComplete && <SendBitcoin />}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
