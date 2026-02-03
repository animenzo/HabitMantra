const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const pushService = require("../services/pushService");
const nodemailer = require("nodemailer");


// ✅ create transporter ONCE (not inside loop)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});



cron.schedule("* * * * *", async () => {
  try {
    // console.log("⏰ CRON RUNNING:", new Date());

    const now = new Date();

    // ✅ only due + active reminders
    const dueReminders = await Reminder.find({
      nextTriggerAt: { $lte: now },
      isActive: true
    }).populate("user");

    for (const reminder of dueReminders) {

      /*
      ========================
      🔔 PUSH NOTIFICATION
      ========================
      */
      await pushService.sendToUser(reminder.user._id, {
        title: "Reminder 🔔",
        body: reminder.title,
        url: "/dashboard"
      });



      /*
      ========================
      📧 EMAIL
      ========================
      */
      await transporter.sendMail({
        to: reminder.user.email,
        subject: "Habit Reminder 🔔",
        text: reminder.title
      });



      /*
      ========================
      🔁 RECURRING LOGIC
      ========================
      */

      if (reminder.repeatType === "once") {
        reminder.isActive = false;
      }

      else if (reminder.repeatType === "daily") {
        reminder.nextTriggerAt = new Date(now.getTime() + 86400000);
      }

      else if (reminder.repeatType === "weekly") {
        reminder.nextTriggerAt = new Date(now.getTime() + 7 * 86400000);
      }

      else if (
        reminder.repeatType === "custom" &&
        reminder.intervalMinutes > 0
      ) {
        reminder.nextTriggerAt = new Date(
          now.getTime() + reminder.intervalMinutes * 60000
        );
      }

      await reminder.save(); // ✅ VERY IMPORTANT
    }

  } catch (err) {
    console.error("CRON ERROR:", err.message);
  }
});
