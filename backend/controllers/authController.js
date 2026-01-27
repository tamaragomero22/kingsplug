import getTransporter from "../config/nodemailer.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code); // For debugging

  let errors = { firstName: "", lastName: "", email: "", password: "" };

  // Duplicate email error
  if (err.code === 11000) {
    const field = err.keyPattern
      ? Object.keys(err.keyPattern)[0]
      : "field";
    errors[field] = `That ${field} is already registered`;
    // Fallback if the field isn't one of our expected error keys
    if (!errors.file && field === "email") {
      errors.email = "That email is already registered";
    }
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

    // Generate and save OTP, then send welcome/verification email
    try {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.verifyOtp = otp;
      // Set OTP to expire in 10 minutes
      user.otpExpiry = Date.now() + 10 * 60 * 1000;

      await user.save(); // Save the OTP and expiry to the database

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Verify Your Account on Kingsplug Exchange",
        text: `Hi ${user.firstName},\n\nWelcome to Kingsplug Exchange!
Your verification OTP is: ${otp}
This code will expire in 10 minutes.\n\nThanks,\nThe Kingsplug Team`,
      };
      await getTransporter().sendMail(mailOptions);
      console.log(`Welcome email sent to ${user.email}`);

      res.status(201).json({ user: user._id });
    } catch (emailError) {
      console.error(`Failed to send welcome email:`, emailError);
      // Allow registration to succeed even if email fails
      // User can request OTP resend later
      console.warn(`User ${user.email} registered but email not sent. OTP: ${user.verifyOtp}`);
      res.status(201).json({
        user: user._id,
        warning: "Registration successful but verification email could not be sent. Please contact support if needed."
      });
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

    if (!user.isAccountVerified) {
      return res.status(401).json({
        errors: { email: "Please verify your email before logging in." },
      });
    }

    const token = createToken(user._id);
    const cookieOptions = {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: "None",
      secure: true, // secure: true works on localhost in modern browsers
    };
    // if (process.env.NODE_ENV === "production") {
    //   cookieOptions.sameSite = "None";
    //   cookieOptions.secure = true;
    // }
    console.log("Logging in. Setting cookie with options:", cookieOptions);
    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const logoutGet = (req, res) => {
  // To log a user out, we replace the JWT cookie with a blank one that expires immediately.
  // The cookie options should match the ones used when setting it.
  const cookieOptions = {
    httpOnly: true,
    maxAge: 1,
    sameSite: "None",
    secure: true,
  };
  // if (process.env.NODE_ENV === "production") {
  //   cookieOptions.sameSite = "None";
  //   cookieOptions.secure = true;
  // }
  // Remove sameSite restrictions for easier localhost dev if not production
  console.log("Clearing cookie with options:", cookieOptions);
  res.cookie("jwt", "", cookieOptions);
  // It's good practice to send a confirmation or redirect.
  res.status(200).json({ message: "User logged out" });
};

// Send verification OTP to the user's email
const sendVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your new verification OTP is: ${otp}. This code will expire in 10 minutes.`,
    };

    await getTransporter().sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Verification OTP sent to your email",
    });
  } catch (error) {
    console.error("Error finding user:", error);
    return res.json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.otpExpiry = 0;

    await user.save();

    // Automatically log the user in by creating a JWT
    const token = createToken(user._id);
    const cookieOptions = {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: "None",
      secure: true,
    };
    // if (process.env.NODE_ENV === "production") {
    //   cookieOptions.sameSite = "None";
    //   cookieOptions.secure = true;
    // }

    console.log("Verifying email. Setting cookie with options:", cookieOptions);
    console.log("Origin:", req.headers.origin);

    res.cookie("jwt", token, cookieOptions);
    // Return user info so the frontend knows the user is authenticated
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isKycVerified: user.isKycVerified,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerGet,
  loginGet,
  registerPost,
  loginPost,
  logoutGet,
  sendVerifyOtp,
  verifyEmail,
};
