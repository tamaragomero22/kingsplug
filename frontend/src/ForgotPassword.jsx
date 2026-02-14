import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Nav } from './Nav';
import './Register.css';

const API_URL = import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === 'kingsplug.com' || window.location.hostname === 'www.kingsplug.com'
        ? 'https://api.kingsplug.com'
        : 'http://localhost:4000');

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
            setMessage(response.data.message);
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Nav />
            <form className="registerForm" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                <p style={{ color: '#ccc', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                    Enter your email address and we will send you a link to reset your password.
                </p>

                <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {message && <div style={{ color: '#80ffea', textAlign: 'center', marginTop: '1rem', padding: '10px', background: 'rgba(128, 255, 234, 0.1)', borderRadius: '4px' }}>{message}</div>}
                {error && <div style={{ color: '#ff4c4c', textAlign: 'center', marginTop: '1rem', padding: '10px', background: 'rgba(255, 76, 76, 0.1)', borderRadius: '4px' }}>{error}</div>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <Link className="forgotPassword" style={{ marginTop: '2rem' }} to="/">Back to Log In</Link>
            </form>
        </>
    );
};

export default ForgotPassword;