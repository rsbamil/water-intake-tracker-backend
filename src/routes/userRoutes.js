import express from "express"
import { getMyProfile , updateMyGoal, deleteMyAccount, getAllUsers, getUserIntakeHistory, getUserById, updateUserGoal, deleteUserByAdmin } from "../controllers/userController.js"
import protect from "../middleware/authMiddleware.js"
import validate from "../middleware/validationMiddleware.js"
import updateGoalValidator from "../validators/userValidator.js"
import authorizeRoles from "../middleware/roleMiddleware.js"


const router = express.Router()
router.use(protect)

// Normal User Routes
// Get Profile
router.get("/me",getMyProfile)

// Update my goad
router.put("/me/goal",updateGoalValidator,validate,updateMyGoal)

//delete my account
router.delete("/me",deleteMyAccount)

// Admin Routes
// Get all Users
router.get("/",protect,authorizeRoles("admin"),getAllUsers)

// Get User Intake
router.get("/:id/intake",protect,authorizeRoles("admin"),getUserIntakeHistory)

// Get user by id
router.get("/:id",protect,authorizeRoles("admin"),getUserById)

// Update User's dailyGoal
router.put("/:id/goal",protect,authorizeRoles("admin"),updateGoalValidator,validate,updateUserGoal)

// Delete user account
router.delete("/:id",protect,authorizeRoles("admin"),deleteUserByAdmin)

export default router
