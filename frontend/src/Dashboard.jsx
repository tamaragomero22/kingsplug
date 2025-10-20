import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Nav } from './Nav';
import './Home.css'; // Import the same styles used by Home.jsx

const Dashboard = () => {
    const [message, setMessage] = useState('');
    const [priceData, setPriceData] = useState(null);
    const navigate = useNavigate();

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
                    navigate('/');
                    return;
                }

                const data = await response.json();
                setMessage(data.message);
                setPriceData(data.priceData);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                navigate('/');
            }
        };

        fetchDashboardData();
    }, [navigate]);

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
            <Nav />
            <div className="container">
                <div className="home-content" style={{ display: 'block', textAlign: 'center' }}>
                    <h2>{message || 'Loading...'}</h2>
                    <h2>
                        {priceData ? `Bitcoin Price: ₦${priceData.bitcoin.ngn.toLocaleString()}` : 'Loading price...'}
                    </h2>
                    {/* Use a button for actions like logging out */}
                    <button onClick={handleLogout} className="btnLogin">Logout</button>
                </div>
            </div>
        </>
    );
};

export default Dashboard;