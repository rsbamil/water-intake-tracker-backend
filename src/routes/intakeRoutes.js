import express from "express"
import { createIntake , getTodayIntake , getIntakeHistory,deleteIntake } from "../controllers/intakeController.js"
import protect from "../middleware/authMiddleware.js"
import validate from "../middleware/validationMiddleware.js"
import createIntakeValidator from "../validators/intakeValidator.js"

const router = express.Router()

router.use(protect)

// Create Intake
router.post("/",createIntakeValidator,validate,createIntake)

// Get Today's Intake
router.get("/today",getTodayIntake)

// Get History
router.get("/history",getIntakeHistory)

// Delete Intake
router.delete("/:id",deleteIntake)

export default router

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTc2ZjgzYWJiNGMxNzgwZTM5MmJjZDAiLCJyb2xlIjoidXNlciIsImlhdCI6MTc4NjI1NzU5NywiZXhwIjoxNzg2ODYyMzk3fQ.zOjWK2SdTWzcDguDh7p8GA_9SB0kuw3dDUtWgYYiEJo