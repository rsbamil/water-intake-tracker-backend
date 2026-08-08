import express from "express"
import cors from "cors"

import dotenv from "dotenv"
import errorMiddleware from "./middleware/errorMiddleware.js"

import authRoutes from "./routes/authRoutes.js"
import intakeRoutes from "./routes/intakeRoutes.js"

import protect from "./middleware/authMiddleware.js"
import authorizeRoles from "./middleware/roleMiddleware.js"


dotenv.config()
const app = express()


app.use(cors({
    origin:process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Water Intake Tracker API is running"
    })
})

app.get("/api/admin/test",protect,authorizeRoles("admin"),(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Admin route accessed successfully",
        user:req.user
    })
})

app.use("/api/auth",authRoutes)
app.use("/api/intake",intakeRoutes)

app.use(errorMiddleware)

export default app