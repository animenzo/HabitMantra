const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  // 👤 Link to user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🔔 Web Push subscription object
  endpoint: {
    type: String,
    required: true,
    unique: true
  },

  keys: {
    p256dh: String,
    auth: String
  },

  // 📱 device info
  device: {
    type: String // mobile | desktop | tablet
  },

  browser: {
    type: String // chrome | firefox | edge
  },

  // enable/disable notifications
  isActive: {
    type: Boolean,
    default: true
  },

  // last used (cleanup stale tokens)
  lastUsedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
