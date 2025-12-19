import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    txHash: { type: String, unique: true },
    toAddress: String,
    amountBTC: Number,
    confirmations: Number,
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
