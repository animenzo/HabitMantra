const mongoose = require("mongoose")

const DailyGoalSchema = new mongoose.Schema({
     title:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    date:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("DailyGoal",DailyGoalSchema)