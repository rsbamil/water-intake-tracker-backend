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

const getAllUsers = async(req,res,next)=>{
  try{
    const users = await User.find({}).select("-password").sort({createdAt:-1})

    return res.status(200).json({
      success:true,
      data:{
        users:users.map((user)=>({
          id:user._id,
          name:user.name,
          email:user.email,
          role:user.role,
          dailyGoal:user.dailyGoal,
          createdAt:user.createdAt
        }))
      }
    })
  }
  catch(error){
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
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

const getUserIntakeHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select(
      "name email dailyGoal"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const history = await IntakeLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$consumedAt",
            },
          },
          totalIntake: {
            $sum: "$amount",
          },
          entries: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dailyGoal: user.dailyGoal || 2000,
        },
        history: history.map((day) => ({
          date: day._id,
          totalIntake: day.totalIntake,
          entries: day.entries,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dailyGoal } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        dailyGoal: Number(dailyGoal),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User's daily goal updated successfully",
      data: {
        userId: user._id,
        dailyGoal: user.dailyGoal,
      },
    });
  } catch (error) {
    next(error);
  }
};


const deleteUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (id === req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot delete their own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted",
      });
    }

    await IntakeLog.deleteMany({
      user: id,
    });

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User and associated intake history deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export {getMyProfile,updateMyGoal,deleteMyAccount,getAllUsers,getUserById,getUserIntakeHistory,updateUserGoal,deleteUserByAdmin}