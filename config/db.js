import mongoose from "mongoose"

export const connectDb= async()=>{

    try {
        await  mongoose.connect(process.env.MONGODB)
        console.log("MongoDb connected successfully");
    } catch (error) {
        console.log("MongoDb not connected")
    }
   
}