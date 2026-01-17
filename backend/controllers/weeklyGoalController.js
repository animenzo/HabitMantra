const WeeklyGoal = require('../models/WeeklyGoal');

//get goals for the current week
exports.getWeeklyGoals = async (req, res) => {
    try {
        const { weekStart } = req.query;

        const goals = await WeeklyGoal.find({ weekStart });

        res.status(200).json(goals)
    } catch (error) {
        res.status(500).json({
            message:'Failed to get weekly goals', error: error.message
        })
    }
}

//create weekly goals
exports.createWeeklyGoals = async (req, res) => {
    try {
        const goal = new WeeklyGoal(req.body)
        const saved = await goal.save();
        res.status(201).json(saved)
        
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create weekly goals', error: error.message
        })
    }
}

//goal toggle

exports.toggleWeeklyGoal = async (req,res)=>{
    try {
        const goal = await WeeklyGoal.findById(req.params.id);
        if(!goal){
            return res.status(404).json({message: 'Weekly goal not found'})
        }
        goal.completed = !goal.completed;
        const updatedGoal = await goal.save();
        res.status(200).json(updatedGoal)
    } catch (error) {
        res.status(500).json({
            message: 'Failed to toggle weekly goal', error: error.message
        })
    }
}