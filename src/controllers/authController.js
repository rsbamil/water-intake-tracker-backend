import bcrypt from "bcryptjs"
import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"

const registerUser = async (req,res,next)=>{
    try{
        const {name , email , password} = req.body
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(409).json({
                success:false,
                message:"User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,12)

        const user = await User.create({
            name,email,password:hashedPassword,
            role:"user"
        })

        const token = generateToken(user._id,user.role)

        return res.status(200).json({
            success:true,
            message:"User registered successfully",
            data:{
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    dailyGoal:user.dailyGoal
                },
                token,
            }
        })
    }
    catch(error){
        next(error)
    }
}

const loginUser = async (req,res,next)=>{
    try{
        const {email , password}= req.body

        const user = await User.findOne({email}).select("+password")

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }

        const passwordMatched = await bcrypt.compare(password,user.password)

        if(!passwordMatched){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }

        const token = generateToken(user._id,user.role)

        return res.status(200).json({
            success:true,
            message:"Login successful",
            data:{
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    dailyGoal:user.dailyGoal
                },
                token
            }
        })
    }
    catch(error){
        next(error)
    }
}

const getMe = async (req,res,next)=>{
    try{
        const user = await User.findById(req.user.userId)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        return res.status(200).json({
            success:true,
            data:{
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    dailyGoal:user.dailyGoal
                }
            }
        })
    }
    catch(error){
        next(error)
    }
}

export {registerUser,loginUser,getMe}