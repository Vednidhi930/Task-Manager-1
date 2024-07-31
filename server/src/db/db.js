import mongoose from "mongoose";
import { DB_Name } from "../constant.js";
import chalk from "chalk";

// connect database
const connectDb=async()=>{
    try {
        const databaseResponse=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
        console.log(chalk.white(` Database is connected with host ${databaseResponse.connection.host}`))
    } catch (err) {
       console.log("Mongodb Database Connection Failed ",err)   
    }
}

export default connectDb;