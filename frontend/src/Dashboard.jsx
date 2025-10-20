import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Nav } from './Nav';
import './Dashboard.css'; // Import the new dashboard styles

const Dashboard = () => {
    const [message, setMessage] = useState('');
    const [priceData, setPriceData] = useState(null);
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // The browser will automatically send the 'jwt' cookie with cross-origin requests
                const response = await fetch('http://localhost:4000/api/dashboard-data', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include' // This is crucial for sending cookies to a different domain
                });

                if (!response.ok) {
                    // If auth middleware returns 401, or for other errors
                    // Only navigate away on the initial load.
                    if (!message) {
                        navigate('/');
                    }
                    return;
                }

                const data = await response.json();
                setMessage(data.message);
                setPriceData(data.priceData);
                // Extract email from the welcome message for the nav
                if (data.message && data.message.startsWith('Welcome,')) {
                    const email = data.message.split(',')[1].trim();
                    setUserEmail(email);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error.message);
                // Only navigate away on initial load failure.
                if (!message) {
                    navigate('/');
                }
            }
        };

        fetchDashboardData();
        const intervalId = setInterval(fetchDashboardData, 10000); // Fetch every 10 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [navigate, message]);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:4000/api/auth/logout', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            // On successful logout, redirect to the homepage
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            // Optionally handle logout errors, e.g., show a notification
        }
    };

    return (
        <>
            <Nav userEmail={userEmail} />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>{message || 'Loading...'}</h2>
                </div>
                <div className="dashboard-content">
                    <div className="price-display">
                        {priceData ? `Bitcoin Price: ₦${priceData.bitcoin.ngn.toLocaleString()}` : 'Loading price...'}
                    </div>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </div>
        </>
    );
};

export default Dashboard;