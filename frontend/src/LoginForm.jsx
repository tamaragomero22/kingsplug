import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';
const API_URL = import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === 'kingsplug.com' || window.location.hostname === 'www.kingsplug.com'
        ? 'https://api.kingsplug.com'
        : 'http://localhost:4000');

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset previous errors
        setEmailError('');
        setPasswordError('');

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' // Essential for sending/receiving cookies cross-origin
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                if (data.errors) {
                    setEmailError(data.errors.email);
                    setPasswordError(data.errors.password);
                }
                throw new Error('Login failed');
            }

            navigate('/dashboard');
        } catch (err) {
            console.error(err.message);
        }
    };


    return (
        <div className="loginFormContainer">
            <form className='loginForm' onSubmit={handleSubmit}>
                <h2>Log in to your account</h2>
                <div className="form-group">
                    <input type="email" name="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <div className="error">{emailError}</div>
                </div>
                <div className="form-group">
                    <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div className="error">{passwordError}</div>
                </div>
                <button type="submit" className="btnLogin">Log In</button>
                <Link className="forgotPassword" to="/forgot-password">Forgotten Password?</Link>
                <hr />
                <Link className="createAccount" to="/register">Don't Have an Account?</Link>
            </form>
        </div>
    );
};

export default LoginForm;