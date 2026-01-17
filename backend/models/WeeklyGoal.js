const mongoose = require('mongoose')

const WeeklyGoalSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    weekStart:{
        type:Date,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("WeeklyGoal",WeeklyGoalSchema);