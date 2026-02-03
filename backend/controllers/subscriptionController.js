const Subscription = require("../models/Subscription");


// ✅ Save / update subscription
exports.saveSubscription = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys) {
      return res.status(400).json({ message: "Invalid subscription data" });
    }

    await Subscription.updateOne(
      { endpoint }, // unique device
      {
        user: req.user._id, // 🔥 attach user
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth
        },
        isActive: true,
        lastUsedAt: new Date()
      },
      { upsert: true }
    );

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ Get all subscriptions of logged-in user
exports.getSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({
      user: req.user._id,
      isActive: true
    });

    res.json(subs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ Disable subscription (user turned off notifications)
exports.disableSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      { isActive: false },
      { new: true }
    );

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json(sub);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ Delete subscription (cleanup / 410 error case)
exports.deleteSubscription = async (req, res) => {
  try {
    await Subscription.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
