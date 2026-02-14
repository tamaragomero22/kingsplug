import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // Only one bank account per user for now
        },
        accountName: {
            type: String,
            required: [true, "Account name is required"],
            trim: true,
        },
        accountNumber: {
            type: String,
            required: [true, "Account number is required"],
            trim: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: (props) => `${props.value} is not a valid 10-digit account number!`,
            },
        },
        bankName: {
            type: String,
            required: [true, "Bank name is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("BankAccount", bankAccountSchema);
