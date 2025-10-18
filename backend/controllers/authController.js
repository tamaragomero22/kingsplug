import User from "../models/User.js";

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
    return errors;
};



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
        res.status(201).json({ message: "User created successfully", userId: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const loginPost = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    res.send('user login');
};

export { registerGet, loginGet, registerPost, loginPost};
