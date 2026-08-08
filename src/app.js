import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import errorMiddleware from "./middleware/errorMiddleware.js"


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

app.use(errorMiddleware)

export default app