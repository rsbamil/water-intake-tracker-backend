import express from "express"
import { createIntake , getTodayIntake , getIntakeHistory,deleteIntake } from "../controllers/intakeController.js"
import protect from "../middleware/authMiddleware.js"
import validate from "../middleware/validationMiddleware.js"
import createIntakeValidator from "../validators/intakeValidtor.js"

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