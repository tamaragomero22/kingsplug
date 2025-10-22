import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Nav } from "./Nav";
import "./Dashboard.css"; // Import the new dashboard styles
import { Footer } from "./Footer";

const Dashboard = () => {
  const [priceData, setPriceData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async (isInitialLoad = false) => {
    try {
      // The browser will automatically send the 'jwt' cookie with cross-origin requests
      const response = await fetch("http://localhost:4000/api/dashboard/data", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // This is crucial for sending cookies to a different domain
      });

      if (!response.ok) {
        // If auth middleware returns 401, or for other errors
        // Only navigate away on the initial load failure.
        if (isInitialLoad) {
          navigate("/");
        }
        return;
      }

      const data = await response.json();
      setPriceData(data.priceData);
      setUserEmail(data.user.email);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error.message);
      // Only navigate away on initial load failure.
      if (isInitialLoad) {
        navigate("/");
      }
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // If user data is passed from the login/verify page, use it immediately.
    // This avoids a race condition where the page fetches data before auth is confirmed.
    let initialLoadPerformed = false;
    if (location.state?.user) {
      setUserEmail(location.state.user.email);
      // We have the user email, so we can skip the initial fetch and just start polling.
      // We also mark the initial load as "done" and set loading to false.
      initialLoadPerformed = true;
      setIsLoading(false);
    }

    // Only fetch immediately if we didn't get user data from the navigation state.
    if (!initialLoadPerformed) {
      fetchDashboardData(true);
    }

    const intervalId = setInterval(() => fetchDashboardData(false), 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [location.state]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/logout", {
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

  return (
    <>
      <Nav userEmail={userEmail} onLogout={handleLogout} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>{isLoading ? "Loading..." : "Dashboard"}</h2>
        </div>
        <div className="dashboard-content">
          <div className="price-display">
            <p>
              {priceData
                ? `Bitcoin Price: ₦${priceData.bitcoin.ngn.toLocaleString()}`
                : "Loading price..."}{" "}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
