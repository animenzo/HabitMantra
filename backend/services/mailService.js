const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOTP = async (email, otp) => {
  await transporter.sendMail({
     from: `"Habit Tracker" <${process.env.EMAIL}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`
  });
};

exports.sendResetLink = async (email, token) => {
  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Reset Password",
    html: `
      <p>Click below to reset password</p>
      <a href="${link}">${link}</a>
    `
  });
};
