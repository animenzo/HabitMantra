const webPush = require("web-push");
const Subscription = require("../models/Subscription");


// 🔐 setup vapid once
webPush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);



/*
========================
Helper: send single push
========================
*/
const sendPush = async (sub, payload) => {
  try {
    await webPush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth
        }
      },
      JSON.stringify(payload)
    );

    // update last used
    sub.lastUsedAt = new Date();
    await sub.save();

  } catch (err) {

    // 🔥 auto cleanup invalid tokens
    if (err.statusCode === 410 || err.statusCode === 404) {
      await Subscription.deleteOne({ _id: sub._id });
    }

    console.error("Push error:", err.message);
  }
};



/*
========================
Send push to ONE USER
========================
*/
exports.sendToUser = async (userId, payload) => {
  const subs = await Subscription.find({
    user: userId,
    isActive: true
  });

  await Promise.all(
    subs.map(sub => sendPush(sub, payload))
  );
};



/*
========================
Send push to MANY USERS
========================
*/
exports.sendToMany = async (userIds, payload) => {
  const subs = await Subscription.find({
    user: { $in: userIds },
    isActive: true
  });

  await Promise.all(
    subs.map(sub => sendPush(sub, payload))
  );
};



/*
========================
Broadcast (optional)
========================
*/
exports.broadcast = async (payload) => {
  const subs = await Subscription.find({ isActive: true });

  await Promise.all(
    subs.map(sub => sendPush(sub, payload))
  );
};
