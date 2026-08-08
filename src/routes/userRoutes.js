import express from "express"
import { getMyProfile , updateMyGoal, deleteMyAccount } from "../controllers/userController.js"
import protect from "../middleware/authMiddleware.js"
import validate from "../middleware/validationMiddleware.js"
import updateGoalValidator from "../validators/userValidator.js"

const router = express.Router()
router.use(protect)

// Get Profile
router.get("/me",getMyProfile)

// Update my goad
router.put("/me/goal",updateGoalValidator,validate,updateMyGoal)

//delete my account
router.delete("/me",deleteMyAccount)

export default router