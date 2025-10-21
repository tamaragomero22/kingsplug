import getTransporter from "../config/nodemailer.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code); // For debugging

  let errors = { firstName: "", lastName: "", email: "", password: "" };

  // Duplicate email error
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  // Validation errors
  if (err.message.includes("User validation failed")) {
    // Loop over the errors and extract the relevant messages
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  // Login errors
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }
  if (err.message === "incorrect password") {
    errors.password = "That password is not correct";
  }

  return errors;
};

// JWT
const maxAge = 3 * 24 * 60 * 60; // JWT duration: 3 days in seconds
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

const registerGet = (req, res) => {
  res.send("sign up");
};

const loginGet = (req, res) => {
  res.send("login");
};

const registerPost = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.create({ firstName, lastName, email, password });

    // Send welcome email after successful registration
    try {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Welcome to Kingsplug Exchange!",
        text: `Hi ${user.firstName},\n\nWelcome to Kingsplug Exchange. Your account has been created successfully.\n\nThanks,\nThe Kingsplug Team`,
      };
      await getTransporter().sendMail(mailOptions);
      console.log(`Welcome email sent to ${user.email}`);

      // Now that email is sent, create token and send response
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
        sameSite: "None",
        secure: true,
      });
      res.status(201).json({ user: user._id });
    } catch (emailError) {
      console.error(`Failed to send welcome email:`, emailError);
      // If email fails, we might not want to complete the registration
      // or at least let the user know. For now, we'll send an error.
      res
        .status(500)
        .json({ errors: { email: "Could not send welcome email." } });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const loginPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: "None",
      secure: true,
    });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const logoutGet = (req, res) => {
  // To log a user out, we replace the JWT cookie with a blank one that expires immediately.
  // The cookie options should match the ones used when setting it.
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: 1,
    sameSite: "None",
    secure: true,
  });
  // It's good practice to send a confirmation or redirect.
  res.status(200).json({ message: "User logged out" });
};

const checkUser = (req, res, next) => {
  // This middleware now runs on all requests, so we only
  // check for a JWT on GET requests.
  if (req.method !== "GET") {
    return next();
  }

  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user; // Make user info available in subsequent middleware/handlers
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

export { registerGet, loginGet, registerPost, loginPost, logoutGet, checkUser };
