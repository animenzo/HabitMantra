const Habit = require('../models/Habit');

//create habit
exports.createHabit = async(req,res) =>{
    try {
        const habit = new Habit({
            name: req.body.name,
        });
        const savedHabit = await habit.save();
        res.status(201).json(savedHabit);

        
    } catch (error) {
        res.status(500).json({message: 'Failed to create habit ', error: error.message});
    }
}
//get all habits
exports.getHabits = async(req,res)=>{
    try{
        const habits = await Habit.find();
        res.status(200).json(habits);
    }catch(error){
        res.status(500).json({message: 'Failed to get habits', error: error.message});
    }
}

//toggle habit for today
exports.toggleHabit = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // ✅ Ensure progress exists
    if (!habit.progress) {
      habit.progress = new Map();
    }

    const current = habit.progress.get(date) === true;
    habit.progress.set(date, !current);

    // 🔥 THIS LINE FIXES YOUR 500 ERROR
    habit.markModified("progress");

    // Streak logic
    let streak = 0;
    let day = new Date();

    while (
      habit.progress.get(day.toISOString().slice(0, 10)) === true
    ) {
      streak++;
      day.setDate(day.getDate() - 1);
    }

    habit.streak = streak;
    habit.bestStreak = Math.max(habit.bestStreak, streak);

    await habit.save();
    res.status(200).json(habit);

  } catch (error) {
    console.error("toggleHabit error:", error);
    res.status(500).json({
      message: "Failed to toggle habit",
      error: error.message
    });
  }
};


// update habit name
exports.updateHabit = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Habit name is required" });
    }

    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update habit",
      error: error.message
    });
  }
};


// delete habit
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({
      message: "Habit deleted successfully",
      habitId: habit._id
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete habit",
      error: error.message
    });
  }
};
