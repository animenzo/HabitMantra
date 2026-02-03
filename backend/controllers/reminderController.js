const Reminder = require("../models/Reminder");


// ✅ Create reminder
exports.createReminder = async (req, res) => {
  try {
    console.log("REq",req.user)
    const reminder = await Reminder.create({
      ...req.body,
      user: req.user._id   // 🔥 attach logged-in user
    });
    

    res.status(201).json(reminder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get all reminders of logged-in user
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({
      user: req.user._id
    }).sort({ nextTriggerAt: 1 });

    res.status(200).json(reminders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Delete reminder
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Toggle active/inactive
exports.toggleReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    reminder.isActive = !reminder.isActive;

    await reminder.save();

    res.json(reminder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Mark completed (habit tracking)
exports.completeReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    const today = new Date();

    reminder.completedDates.push(today);
    reminder.lastCompletedAt = today;
    reminder.streak += 1;

    await reminder.save();

    res.json(reminder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
