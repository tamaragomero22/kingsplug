import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            const res = await fetch('http://localhost:4000/api/auth/login', {
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
                throw new Error('Registration failed');
            }

            navigate('/dashboard');
        } catch (err) {
            console.error(err.message);
        }
    };


    return (
        <div className="signup-form-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Log in to your account</h2>
                <div className="form-group">
                    <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <div className="error">{emailError}</div>
                </div>
                <div className="form-group">
                    <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div className="error">{passwordError}</div>
                </div>
                <button type="submit" className="btn-signup">Log In</button>
            </form>
        </div>
    );
};

export default LoginForm;