import resend from "../config/nodemailer.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getWelcomeEmailHtml, getOtpEmailHtml, getResetPasswordEmailHtml } from "../utils/emailTemplates.js";

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
    console.log("Attempting to create user in DB:", mongoose.connection.name);
    console.log("Connection state:", mongoose.connection.readyState);
    const user = await User.create({ firstName, lastName, email, password });
    console.log("User created with ID:", user._id);

    // Generate and save OTP, then send welcome/verification email
    try {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.verifyOtp = otp;
      // Set OTP to expire in 10 minutes
      user.otpExpiry = Date.now() + 10 * 60 * 1000;

      await user.save(); // Save the OTP and expiry to the database

      const resendResponse = await resend.emails.send({
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Verify Your Account on Kingsplug Exchange",
        html: getWelcomeEmailHtml(user.firstName, otp),
      });

      if (resendResponse.error) {
        console.error("Resend API Error:", resendResponse.error);
        throw new Error(`Resend Welcome Email Error: ${resendResponse.error.message}`);
      }
      console.log(`Welcome email sent successfully. ID: ${resendResponse.data.id}`);

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
        errors: { email: "Your account has not been verified." },
        userId: user._id
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
    res.status(200).json({ user: user._id, token });
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

    const { error: otpError } = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      html: getOtpEmailHtml(otp),
    });

    if (otpError) {
      throw new Error(`Resend OTP Email Error: ${otpError.message}`);
    }

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
      token,
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

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password
    const auth = await bcrypt.compare(currentPassword, user.password);
    if (!auth) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    const errors = handleErrors(err);
    // If it's a validation error for password, extract the message
    const message = errors.password || "Failed to update password";
    res.status(400).json({ success: false, message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: "If an account with that email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetOtp = resetToken;
    user.resetOtpExpiry = Date.now() + 3600000;

    await user.save();

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${email}`;

    const { error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Your Password - Kingsplug Exchange",
      html: getResetPasswordEmailHtml(user.firstName, resetLink),
    });

    if (error) {
      throw new Error(`Email failed: ${error.message}`);
    }

    res.status(200).json({ success: true, message: "If an account with that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ success: false, message: "Failed to send reset email" });
  }
};

const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await User.findOne({ email, resetOtp: token });

    if (!user || user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = newPassword;
    user.resetOtp = "";
    user.resetOtpExpiry = 0;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    const errors = handleErrors(err);
    const message = errors.password || "Failed to reset password";
    res.status(400).json({ success: false, message });
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
  changePassword,
  forgotPassword,
  resetPassword,
};
