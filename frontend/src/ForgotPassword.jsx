import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from './Nav';
import './Register.css'; // Reusing styles from Register.css for consistency

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset message on new submission

        // ** In a real app, you would make an API call to your backend here **
        console.log('Password reset requested for:', email);
        
        // We'll simulate a successful request for now.
        setMessage('If an account with that email exists, a password reset link has been sent.');
        setEmail(''); // Clear the input field
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
                {message && <div style={{ color: '#80ffea', textAlign: 'center', marginTop: '1rem' }}>{message}</div>}
                <button type="submit">Send Reset Link</button>
                <Link className="forgotPassword" style={{ marginTop: '2rem' }} to="/">Back to Log In</Link>
            </form>
        </>
    );
};

export default ForgotPassword;