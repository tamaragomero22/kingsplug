import User from "../models/User.js";
import validator from "validator";

export const submitKYC = async (req, res) => {
  const { firstName, lastName, gender, dateOfBirth, mobileNumber, bvn } =
    req.body;
  const userId = req.user._id; // From requireAuth middleware

  try {
    // Basic validation
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !dateOfBirth ||
      !mobileNumber ||
      !bvn
    ) {
      return res.status(400).json({ message: "All KYC fields are required." });
    }

    // More specific validation can be added here if needed
    if (!/^\d{11}$/.test(bvn)) {
      return res
        .status(400)
        .json({ message: "BVN must be an 11-digit number." });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, gender, dateOfBirth, mobileNumber, bvn },
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
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res
        .status(409)
        .json({ message: `This ${field} is already registered.` });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(", ") });
    }
    res.status(500).json({ message: "Failed to submit KYC information." });
  }
};
