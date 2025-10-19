import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav } from './Nav';

const Dashboard = () => {
    const [message, setMessage] = useState('');
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
                    navigate('/login');
                    return;
                }

                const data = await response.json();
                setMessage(data.message);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                navigate('/login');
            }
        };

        fetchDashboardData();
    }, [navigate]);

    return (
        <>
            <Nav />
            <h1>{message || 'Loading...'}</h1>
        </>
    );
};

export default Dashboard;