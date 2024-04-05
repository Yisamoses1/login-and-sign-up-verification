const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    }
});

userSchema.pre('save', async function (next) {
    try {
        // Check if the password is modified or new
        if (!this.isModified('password')) {
            return next();
        }

        // Generate salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password
        const hashedPassword = await bcrypt.hash(this.password, salt);

        // Replace the plain password with the hashed one
        this.password = hashedPassword;

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("User", userSchema);
