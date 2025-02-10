import mongoose from "mongoose";
import { DB_NAME } from "../Constant.js";


const connectDB = async () =>{
    try {
        const connsctionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}}`)
        console.log(`\n MongoDB connected!! DB HOST: ${connsctionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection error", error);
        process.exit(1);
    }
}

export default connectDB;