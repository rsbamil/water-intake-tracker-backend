import mongoose from "mongoose";

const intakeLogSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User is required"],
        index:true
    },
    amount:{
        type:Number,
        required:[true,"Water intake amount is required"],
        min:[1,"Water intake must be greater than 0"]
    },
    consumedAt:{
        type:Date,
        default:Date.now,
    },
},{timestamps:true})

const IntakeLog = mongoose.model("IntakeLog",intakeLogSchema)

export default IntakeLog