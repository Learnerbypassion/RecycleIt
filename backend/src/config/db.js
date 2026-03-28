import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Data-base is connected");
        
    } catch (error) {
        console.log("Data-base connection error. "+error)
    }
}

export default connectDB