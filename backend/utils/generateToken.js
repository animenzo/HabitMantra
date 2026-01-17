// utils/generateToken.js
const jwt = require("jsonwebtoken");

module.exports = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "180d" }
  );
};
