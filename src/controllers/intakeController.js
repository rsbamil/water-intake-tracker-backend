import mongoose from "mongoose";
import IntakeLog from "../models/IntakeLog.js"
import User from "../models/User.js";

const createIntake = async (req,res,next)=>{
    try{
        const {amount} = req.body

        const intake = await IntakeLog.create({
            user:req.user.userId,
            amount:Number(amount),
            consumedAt:new Date(),
        })

        return res.status(201).json({
            success:true,
            message:"Water intake logged successfully",
            data:{
                intake:{
                    id:intake._id,
                    amount:intake.amount,
                    consumedAt:intake.consumedAt
                }
            }
        })
    }
    catch(error){
        next(error)
    }
}

const getTodayIntake = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [result, entries, user] =
      await Promise.all([
        IntakeLog.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(
                userId
              ),
              consumedAt: {
                $gte: startOfDay,
                $lte: endOfDay,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$amount",
              },
            },
          },
        ]),

        IntakeLog.find({
          user: userId,
          consumedAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        })
          .sort({
            consumedAt: -1,
          })
          .select(
            "_id amount consumedAt"
          ),

        User.findById(userId).select(
          "dailyGoal"
        ),
      ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const totalIntake =
      result.length > 0
        ? result[0].total
        : 0;

    const dailyGoal =
      user.dailyGoal || 2000;

    const progress = Math.min(
      Math.round(
        (totalIntake / dailyGoal) * 100
      ),
      100
    );

    const remaining = Math.max(
      dailyGoal - totalIntake,
      0
    );

    return res.status(200).json({
      success: true,

      data: {
        totalIntake,
        dailyGoal,
        remaining,
        progress,
        goalReached:
          totalIntake >= dailyGoal,

        entries,
      },
    });
  } catch (error) {
    next(error);
  }
};


  const getIntakeHistory = async (req, res, next) => {
    try {
      const userId = req.user.userId;
  
      const history = await IntakeLog.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
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
  
  const deleteIntake = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid intake entry ID",
        });
      }
  
      const intake = await IntakeLog.findById(id);
  
      if (!intake) {
        return res.status(404).json({
          success: false,
          message: "Intake entry not found",
        });
      }
  
      if (intake.user.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "You cannot delete another user's intake entry",
        });
      }
  
      await IntakeLog.findByIdAndDelete(id);
  
      return res.status(200).json({
        success: true,
        message: "Intake entry deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  export {createIntake,getTodayIntake,getIntakeHistory,deleteIntake}