import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        match:[
            /^\S+@\S+\.\S+$/,
    "Please provide a valid email address",
        ]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:[7,"password must be atleast 7 character"],
        select:false
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    dailyGoal:{
        type:Number,
        default:2000,
        min:[1,"Daily goal must be greater than 0"]
    },
},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User