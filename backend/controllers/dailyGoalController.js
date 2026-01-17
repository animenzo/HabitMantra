const DailyGoal = require('../models/DailyGoals');


exports.getDailyGoals = async(req,res) => {
    try{
        const {date} = req.query;
        const goals = await DailyGoal.find({date})
        res.status(200).json(goals)

    }catch(error){
        res.status(200).json({message:"Failed to fetch daily goals",error:error.message})
    }
}

exports.createDailyGoal = async(req,res)=>{
    try {
         const goal = new DailyGoal(req.body)
         const saved = await goal.save()
         res.status(201).json(saved)

    } catch (error) {
        res.status(500).json({message:"Failed to create daily goal",error:error.message})
    }

}

exports.toggledailyGoal = async(req,res)=>{
    try {
        
        const goal = await DailyGoal.findById(req.params.id)
        if(!goal){
            return res.status(404).json({message:"Daily goal not found"})
        }
        goal.completed = !goal.completed
        await goal.save()
        return res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({message:"Failed to toggle daily goal",error:error.message})
    }
}

exports.updateDailyGoal = async(req,res)=>{
    try{
        const update = await DailyGoal.findByIdAndUpdate(
            req.params.id,
            {title:req.body.title},
            {new:true}
        )
        res.status(200).json(update)
    }catch(error){
        res.status(500).json({message:"Failed to update daily goal",error:error.message})
    }
}

exports.deleteDailyGoal = async (req,res)=>{
    try {
        await DailyGoal.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Daily goal deleted successfully"})
    } catch (error) {
        res.status(200).json({message:"Failed to delete daily goal",error:error.message})
    }
}

