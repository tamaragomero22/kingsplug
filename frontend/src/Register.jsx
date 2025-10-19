import { useState } from 'react';
import './Register.css';

const Register = () => {
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
            const res = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (!res.ok) {
                // If response is not OK, it means there are validation errors
                if (data.errors) {
                    setEmailError(data.errors.email);
                    setPasswordError(data.errors.password);
                }
                throw new Error('Registration failed'); // This should be inside the if block
            }

            // If registration is successful
            console.log('Registration successful:', data);
            // You can redirect the user or show a success message here
            // For example: window.location.href = '/login';

        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign up</h2>
            <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="email error">{emailError}</div>

            <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="error">{passwordError}</div>

            <button type="submit">Sign up</button>
        </form>
    );
};

export default Register;