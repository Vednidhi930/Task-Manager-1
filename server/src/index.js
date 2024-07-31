import dotenv from "dotenv";
import connectDb from "./db/db.js";
import { app } from "./app.js";
import chalk from "chalk";

dotenv.config({path:"./env"});

connectDb()

.then(()=>{
    app.listen(process.env.PORT || 9000 ,()=>console.log(chalk.white(`server is running at port ${process.env.PORT}`)))
})
.catch((err)=>{console.log("Database connection Failed",err)});
