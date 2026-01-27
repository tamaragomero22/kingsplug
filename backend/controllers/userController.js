import User from "../models/User.js";
import validator from "validator";

export const submitKYC = async (req, res) => {
  const { firstName, lastName, gender, dateOfBirth, mobileNumber } =
    req.body;
  const user_id = req.user ? req.user._id : null; // From requireAuth middleware

  console.log(`KYC submission attempt for user_id: ${user_id}`);

  if (!user_id) {
    return res.status(401).json({ message: "Not authorized, user not found." });
  }

  try {
    // Basic validation
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !dateOfBirth ||
      !mobileNumber ||
      !mobileNumber
    ) {
      return res.status(400).json({ message: "All KYC fields are required." });
    }

    // More specific validation can be added here if needed


    const user = await User.findByIdAndUpdate(
      user_id,
      {
        firstName,
        lastName,
        gender,
        dateOfBirth,
        mobileNumber,
        mobileNumber,
        isKycVerified: true,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({ message: "KYC information submitted successfully!", user });
  } catch (error) {
    console.error("Error submitting KYC:", error);

    // Handle generic 500 errors or specific mongoose errors
    if (error.code === 11000) {
      // Duplicate key error
      const field = error.keyPattern ? Object.keys(error.keyPattern)[0] : "field";
      return res
        .status(409)
        .json({ message: `This ${field} is already registered.` });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(", ") });
    }

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid data format." });
    }

    res.status(500).json({
      message: "Failed to submit KYC information.",
      error: error.message,
    });
  }
};
