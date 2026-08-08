import dotenv from "dotenv"

dotenv.config()

import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/User.js"

const createAdmin = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)

        const adminEmail = "admin@gmail.com"
        const adminPassword = "admin123"

        const existingAdmin = await User.findOne({email:adminEmail})

        if(existingAdmin){
            console.log("Admin account already exists")
            process.exit(0)
        }

        const hashedPassword = await bcrypt.hash(adminPassword,12)

        await User.create({
            name:"Water Tracker Admin",
            email:adminEmail,
            password:hashedPassword,
            role:"admin",
            dailyGoal:2000
        })

        console.log("Admin account created successfully.");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

    process.exit(0);
    }
    catch(error){
        console.error("Failed to create admin:", error.message);
    process.exit(1);
    }
}

createAdmin()