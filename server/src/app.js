import express from "express"
import upload from "./multer/multer.js";
// import awsupload from "./multer/multers3.js"

import 
{
 loginUser,
 registerUser , 
 userHome , 
 loggedOut , 
 taskData ,
 getTaskData , 
 deleteTask , 
 CompletedTaskUpdate ,  
//  sendEmail ,
 mainTask ,
 completedTask,
 setUserProfile,
 incompletedTask,
 userProfile,
 removeUserProfile,
 EmailVerification,
 changepassword,
 otpverification,
 awsuserProfile,
} from "./controllers/controller.js";

import { signUpschema } from "./SchemaValidation/SchemaValidation.js";
import { validationMiddleware } from "./validationMiddleware/validationMiddleware.js";
import {loginSchema} from "./SchemaValidation/loginValidationSchema.js"
import {loginValidationMiddleware} from "./validationMiddleware/loginValidationMiddleware.js"
import cookieParser from "cookie-parser"
import loginMiddleware from "./middlewares/loginMiddleware.js"
import chalk from "chalk"
// import errorMiddleware from "./middlewares/errorMiddleware.js";
const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
// app.use(errorMiddleware)
// app.use(validationMiddleware(signUpschema))
app.route("/user/register").post(validationMiddleware(signUpschema),registerUser);
app.route("/user/login").post(loginValidationMiddleware(loginSchema),loginUser)
app.route("/user").get(loginMiddleware,userHome)
app.route("/user/logout").get(loggedOut)
app.route("/user/task").post(taskData)
app.route("/user/tasks").get(getTaskData)
app.route("/user/delete/:id").delete(deleteTask)
app.route("/user/update/:id").put(CompletedTaskUpdate)
app.route("/user/mainTask/update/:id").put(mainTask)
// app.route("/user/email").get(sendEmail)
app.route("/user/completedTasks").get(completedTask)
app.route("/user/incompletedTasks").get(incompletedTask)

app.route("/user/profile").post(upload.single("file"),userProfile)
app.route("/user/aws").post(awsuserProfile)




app.route("/user/otp").post(otpverification)









app.route("/user/resetpassword").post(EmailVerification)
app.route("/user/changepassword").post(changepassword)








app.route("/user/profile").get(setUserProfile)
app.route("/user/remove/profile").get(removeUserProfile)

export {app}
