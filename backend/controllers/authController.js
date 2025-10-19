import User from "../models/User.js";
import jwt from 'jsonwebtoken';

// Handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code); // For debugging

    let errors = { email: '', password: '' };

    // Duplicate email error
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    // Validation errors
    if (err.message.includes('User validation failed')) {
        // Loop over the errors and extract the relevant messages
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    // Login errors
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }
    if (err.message === 'incorrect password') {
        errors.password = 'That password is not correct';
    }

    return errors;
};

// JWT
const maxAge = 3 * 24 * 60 * 60 // JWT duration: 3 days in seconds
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

const registerGet = (req, res) => {
    res.send('sign up');
};

const loginGet = (req, res) => {
    
    res.send('login');
};


const registerPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
            // Use 'None' for cross-site requests, and 'Lax' for same-site.
            sameSite: 'None',
            secure: true // 'secure' must be true when sameSite is 'None'
        });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const loginPost = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
            sameSite: 'None',
            secure: true
        });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const logoutGet = (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, maxAge: 1, sameSite: 'None', secure: true });
    // It's good practice to send a confirmation or redirect.
    res.status(200).json({ message: 'User logged out' });
    
};

export { registerGet, loginGet, registerPost, loginPost, logoutGet };
