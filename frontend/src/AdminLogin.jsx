import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AdminLogin.css';

const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:4000'
    : (import.meta.env.VITE_API_BASE_URL || 'https://api.kingsplug.com');

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors) {
                    setEmailError(data.errors.email);
                    setPasswordError(data.errors.password);
                }
                throw new Error('Login failed');
            }

            if (!data.isAdmin) {
                // User is not an admin. Log them out and show error.
                await fetch(`${API_URL}/api/auth/logout`, {
                    method: 'GET',
                    credentials: 'include'
                });
                setGeneralError('Access Denied: You do not have admin privileges.');
                return;
            }

            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="adminLoginContainer">
            <form className='adminLoginForm' onSubmit={handleSubmit}>
                <h2>Admin Portal Login</h2>
                {generalError && <div className="general-error">{generalError}</div>}
                <div className="form-group">
                    <input type="email" name="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <div className="error">{emailError}</div>
                </div>
                <div className="form-group">
                    <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div className="error">{passwordError}</div>
                </div>
                <button type="submit" className="btnAdminLogin">Login to Admin</button>
                <Link className="backToSite" to="/">Back to Main Site</Link>
            </form>
        </div>
    );
};

export default AdminLogin;
