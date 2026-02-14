import User from "../models/User.js";
import BankAccount from "../models/BankAccount.js";
import validator from "validator";
import axios from "axios";

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

// Save or update Nigerian Bank Account
export const saveBankAccount = async (req, res) => {
  const { accountName, accountNumber, bankName } = req.body;
  const user_id = req.user ? req.user._id : null;

  if (!user_id) {
    return res.status(401).json({ message: "Not authorized." });
  }

  try {
    if (!accountName || !accountNumber || !bankName) {
      return res.status(400).json({ message: "All bank details are required." });
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      return res.status(400).json({ message: "Account number must be 10 digits." });
    }

    const bankAccount = await BankAccount.findOneAndUpdate(
      { userId: user_id },
      { accountName, accountNumber, bankName },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Bank account saved successfully!",
      bankAccount,
    });
  } catch (error) {
    console.error("Error saving bank account:", error);
    res.status(500).json({
      message: "Failed to save bank account.",
      error: error.message,
    });
  }
};

// Get user's Nigerian Bank Account
export const getBankAccount = async (req, res) => {
  const user_id = req.user ? req.user._id : null;

  if (!user_id) {
    return res.status(401).json({ message: "Not authorized." });
  }

  try {
    const bankAccount = await BankAccount.findOne({ userId: user_id });
    res.status(200).json({ success: true, bankAccount });
  } catch (error) {
    console.error("Error fetching bank account:", error);
    res.status(500).json({
      message: "Failed to fetch bank account.",
      error: error.message,
    });
  }
};

// Resolve Nigerian Bank Account Name using Paystack
export const resolveBankAccount = async (req, res) => {
  const { accountNumber, bankCode } = req.body;
  const user_id = req.user ? req.user._id : null;

  if (!user_id) {
    return res.status(401).json({ message: "Not authorized." });
  }

  try {
    if (!accountNumber || !bankCode) {
      return res.status(400).json({ message: "Account number and bank code are required." });
    }

    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status) {
      res.status(200).json({
        success: true,
        accountName: response.data.data.account_name,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Could not resolve account name. Please check details.",
      });
    }
  } catch (error) {
    console.error("Paystack Resolution Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Failed to resolve bank account.",
    });
  }
};
