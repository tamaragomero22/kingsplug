import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    otpExpiry: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpiry: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    mobileNumber: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (v) {
          return !v || validator.isMobilePhone(v, "any");
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    bvn: {
      type: String,
      unique: true,
      sparse: true,
      minlength: [11, "BVN must be 11 digits"],
      maxlength: [11, "BVN must be 11 digits"],
      validate: {
        validator: function (v) {
          return !v || /^\d{11}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid 11-digit BVN!`,
      },
    },
    isKycVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields in the database
  }
);

// Mongoose 'pre-save' hook to hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method to log in a user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

export default mongoose.model("User", userSchema);
