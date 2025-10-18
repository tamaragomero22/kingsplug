import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Mongoose 'pre-save' hook to hash password before saving
userSchema.pre('save', async function(next) {
   

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method to log in a user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

export default mongoose.model('User', userSchema);