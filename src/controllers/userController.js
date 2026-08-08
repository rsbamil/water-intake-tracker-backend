import mongoose from "mongoose";
import User from "../models/User.js";
import IntakeLog from "../models/IntakeLog.js";

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:"Profile fetched successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          dailyGoal: user.dailyGoal || 2000,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateMyGoal = async (req,res,next)=>{
    try{
        const {dailyGoal} = req.body

        const user = await User.findByIdAndUpdate(req.user.userId,{
            dailyGoal:Number(dailyGoal)
        },{
            new:true,
            runValidators:true
        })

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
              });
        }

        return res.status(200).json({
            success:true,
            message:"Daily water goal updated successfully",
            data:{
                dailyGoal:user.dailyGoal
            }
        })
    }
    catch(error){
        next(error)
    }
}

const deleteMyAccount = async(req,res,next)=>{
    try{
        const userId = req.user.userId
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }
        if(user.role==="admin"){
            return res.status(403).json({
                success:false,
                message:"Admin accounts cannot be deleted through this route"
            })
        }
        await IntakeLog.deleteMany({
            user:userId
        })

        await User.findByIdAndDelete(userId)

        return res.status(200).json({
            success:true,
            message:"Your account and intake history were deleted successfully"
        })
    }
    catch(error){
        next(error)
    }
}

export {getMyProfile,updateMyGoal,deleteMyAccount}