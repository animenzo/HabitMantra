const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: String,

  googleId: String,

  isVerified: {
    type: Boolean,
    default: false
  },

  otp: String,
  otpExpiry: Date,
refreshToken: String,

  resetToken: String,
  resetTokenExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
