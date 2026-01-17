const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/jwt");

const generateOtp = require("../utils/generateOtp");
const { sendOTP, sendResetLink } = require("../services/mailService");

/* ---------------- HELPER: ISSUE TOKENS ---------------- */
const issueTokens = async (user, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // true in prod
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return accessToken;
};

/* ---------------- SIGNUP ---------------- */
exports.signup = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email & password required" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const otp = generateOtp();

  await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000
  });

  await sendOTP(email, otp);
  res.json({ message: "OTP sent to email" });
};

/* ---------------- VERIFY OTP ---------------- */
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = null;
  user.otpExpiry = null;
  user.isVerified = true;

  const accessToken = await issueTokens(user, res);

  res.json({
    token: accessToken,
    user
  });
};

/* ---------------- LOGIN ---------------- */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!user.isVerified) {
    return res.status(403).json({ message: "Email not verified" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = await issueTokens(user, res);

  res.json({
    token: accessToken,
    user
  });
};

/* ---------------- GOOGLE LOGIN ---------------- */
exports.googleLogin = async (req, res) => {
  const { email, name, googleId } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name,
      googleId,
      isVerified: true
    });
  }

  const accessToken = await issueTokens(user, res);

  res.json({
    token: accessToken,
    user
  });
};

/* ---------------- REFRESH TOKEN ---------------- */
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.sendStatus(403);
    }

    const newAccessToken = generateAccessToken(user._id);
    res.json({ token: newAccessToken });
  } catch {
    res.sendStatus(403);
  }
};

/* ---------------- LOGOUT ---------------- */
exports.logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

/* ---------------- FORGOT PASSWORD ---------------- */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "Email sent if exists" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  await sendResetLink(email, token);
  res.json({ message: "Reset link sent" });
};

/* ---------------- RESET PASSWORD ---------------- */
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  res.json({ message: "Password reset successful" });
};
