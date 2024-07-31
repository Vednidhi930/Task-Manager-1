import { userModel } from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { taskModel } from "../models/task.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodeMailer from "nodemailer";
import crypto from "crypto"

//configuration of cloudinary
cloudinary.config({ 
  cloud_name: 'dnbcby8ky', 
  api_key: process.env.API_KEY,
  api_secret:process.env.API_SECRET // Click 'View Credentials' below to copy your API secret
});



// registration
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const findEmail=await userModel.findOne({email})
  if(findEmail){
    res.status(422).json({message:"Email is already exist"})
  } else{
    const hashPassowrd = await bcrypt.hash(password, 10);

    const user = new userModel({
      username: username,
      email: email,
      password: hashPassowrd,
    });
  
    await user.save();
    res.status(200).json({ message: "User is registered successfully" });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const findUser = await userModel.findOne({ email });
  console.log(findUser)
  if (!findUser) {
    res.status(422).json({ message: "user doesn't exist" });
  } else {
    const userId = findUser._id;
    console.log(userId);
    const comparePassword = await bcrypt.compare(password, findUser.password);
    if (!comparePassword) {
      res.status(422).json({ message: "Incorrect Password" });
    } else {
      const UserToken = jwt.sign({ email , userId }, process.env.JWT_SECRECT);

      const options = {
        expire: new Date(Date.now()),
        httpOnly: true,
        secure: true,
      };

      res
        .cookie("userToken", UserToken, options)
        .status(200)
        .json({ message: "Login Successfully" });
    }
  }
};

//logout

const loggedOut = (req, res) => {
  const loggedInUser = req.cookies.userToken;

  if (loggedInUser)
    res
      .clearCookie("userToken")
      .status(200)
      .json({ message: "Thanks! Come Back again" });
};

// Task Data

const taskData = async (req, res) => {
  const { title, description, date } = req.body;
  console.log(title, description, date);

  const userToken = req.cookies.userToken;
  console.log(userToken);
  if (!userToken) {
    res.json({ message: "login First" }).status(422);
  } else {
    const checkUser = jwt.verify(userToken, process.env.JWT_SECRECT);
    const userId = checkUser.userId;
    const taskData = new taskModel({
      title: title,
      description: description,
      taskdate:date,
    });
    const saveData = await taskData.save();
    const taskId = saveData._id;

    const taskUser = await userModel.findByIdAndUpdate(userId, {
      $push: { tasks: taskId },
    });
    if (!taskUser) {
      res.json({ message: "invalid user" }).status(422);
    } else {
      taskUser.tasks.push(saveData._id);
      res.json({ message: "task created" }).status(200);
    }
  }
};

const getTaskData = async (req, res) => {
  try {
    const userToken = req.cookies.userToken;
    if (!userToken) {
      res.json({ message: "login First" }).status(422);
    } else {
      const checkUser = jwt.verify(userToken, process.env.JWT_SECRECT);
      if (!checkUser) {
        res.json({ message: "token expired" });
      } else {
        const userId = checkUser.userId;
        const user = await userModel.findOne({ _id: userId }).populate("tasks");
        res.json({ message: "done", user: user }).status(200);
      }
    }
  } catch (error) {
    res.json({ message: "internal server error" }).status(422);
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userToken = req.cookies.userToken;
  if (!userToken) {
    res.json({ message: "Login First" }).status(200);
  } else {
    const checkUser = jwt.verify(userToken, process.env.JWT_SECRECT);
    if (!checkUser) {
      res.json({ message: "token expired" });
    } else {
      const userId = checkUser.userId;
      await taskModel.findByIdAndDelete(id);
      await userModel.findByIdAndUpdate(userId, { $pull: { tasks: id } });
      res.json({ message: "task deleted" }).status(200);
    }
  }
};

// Task complete update
const CompletedTaskUpdate = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const userToken = req.cookies.userToken;
  if (!userToken) {
    res.json({ message: "Login First" }).status(200);
  } else {
    const checkUser = jwt.verify(userToken, process.env.JWT_SECRECT);
    if (!checkUser) {
      res.json({ message: "token expired" });
    } else {
      const task = await taskModel.findByIdAndUpdate(id);
      const completedTask = task.completed;
      await taskModel.findByIdAndUpdate(id, { completed: !completedTask });
      res.json({ message: "task updated" }).status(200);
    }
  }
};

const mainTask = async (req, res) => {
  const { title, description, color } = req.body;
  const { id } = req.params;
  console.log(id, title, description, color);

  const userToken = req.cookies.userToken;
  if (!userToken) {
    res.json({ message: "Login First" }).status(200);
  } else {
    const checkUser = jwt.verify(userToken, process.env.JWT_SECRECT);
    if (!checkUser) {
      res.json({ message: "token expired" });
    } else {
      await taskModel.findByIdAndUpdate(id, {
        title: title,
        description: description,
        color: color,
      });
      res.json({ message: "task updated" }).status(200);
    }
  }
};

const completedTask = async (req, res) => {
  const userToken = req.cookies.userToken;
  if (!userToken) {
    res.json({ message: "Login First" }).status(200);
  } else {
    const checkUser = jwt.verify(userToken, process.env.JWT_SECRECT);
    if (!checkUser) {
      res.json({ message: "token expired" });
    } else {
      const userId = checkUser.userId;
      const taskData = await userModel.findById(userId).populate({
        path: "tasks",
        match: { completed: true },
      });
      res.json({ taskData: taskData }).status(200);
    }
  }
};

const incompletedTask=async(req,res)=>{
  const userToken = req.cookies.userToken;
  if (!userToken) {
    res.json({ message: "Login First" }).status(200);
  } else {
    const checkUser = jwt.verify(userToken, process.env.JWT_SECRECT);
    if (!checkUser) {
      res.json({ message: "token expired" });
    } else {
      const userId = checkUser.userId;
      const taskData = await userModel.findById(userId).populate({
        path: "tasks",
        match: { completed: false },
      });
      res.json({ taskData: taskData }).status(200);
    }
  }
}


// const OTP=Math.floor(1+Math.random()*9000)
// console.log(OTP)

// generate otp and send with the help of gmail
const sendEmail = (req, res) => {
  //3467

  //5632     5531     5551 
 
  const randomNumber=crypto.randomInt(0,10000)
  const OTP =String(randomNumber).padStart(4, '5');
  

  const emailProvider = nodeMailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465, // gmail by default port is 465
    auth: {
      user: "shanukumar7988@gmail.com",
      pass:"qoddpqeklnzuluyd", // fir apko gmail ka password dena hai kuch aisa agr aapke gmail pe 2 step authentication on h to
    },
    tls: { rejectUnauthorized: false },
  });

  const receiver = {
    from: "shanukumar7988@gmail.com",
    to: "coderved930@gmail.com",
    subject: "OTP Verification",
    text: `Your One Time Password(OTP) is ${OTP}`,
  };

  emailProvider.sendMail(receiver, (error, emailResponse) => {
    if (error) {
      res.status(422).json({ message: error });
    } else {
      res.status(200).json({ message: "otp send successfully on your gmail account" });
    }
  });
};

const userProfile=async(req,res)=>{

  const file=req.file.path
  // // console.log(file)

  // try {
  //   const fileUpload =await cloudinary.uploader.upload(file,{resource_type:"auto"})
  //    console.log(fileUpload.url)  
  // } catch (error) {
  //   console.log("Some error occured",error)
  // }

  const userToken = req.cookies.userToken;
  if (!userToken) {
    res.json({ message: "Login First" }).status(200);
  } else {
    const checkUser = jwt.verify(userToken, process.env.JWT_SECRECT);
    if (!checkUser) {
      res.json({ message: "token expired" });
    } else {

      const userId = checkUser.userId;
      if(!userId){
        res.status(200).json({message:"User not found"})
      }else{
        try {
          const fileUpload =await cloudinary.uploader.upload(file,{resource_type:"auto"})
          const user=await userModel.findById(userId)
          user.profileImage=fileUpload.url
          await user.save()

        } catch (error) {
          console.log(error)
        }
      }
    }
    }
}

const userHome = (req, res) => {
  // res
  // .status(200)
  // .json({message:"Token verified"})
};

const setUserProfile=async(req,res)=>{

  const userToken=req.cookies.userToken;

  const checkUser = jwt.verify(userToken, process.env.JWT_SECRECT);
  const user=checkUser.userId
  const profileImage=await userModel.findById(user)
  res
  .status(200)
  .json({user:profileImage})
}

const removeUserProfile=async(req,res)=>{
  const userToken = req.cookies.userToken;
  if (!userToken) {
    res.json({ message: "Login First" }).status(200);
  } else {
    const checkUser = jwt.verify(userToken, process.env.JWT_SECRECT);
    if (!checkUser) {
      res.json({ message: "token expired" });
    } else {
      const userId = checkUser.userId;
      const user=await userModel.findById(userId)
      user.profileImage="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
      await user.save()
      res.json({ message: "Profile Picture Removed" }).status(200);
    }
  }
}



const EmailVerification=async(req,res)=>{

  const{email}=req.body
  console.log(email)

  const user=await userModel.findOne({email})
   if(!user){
    res.status(422).json({message:"Email does not exist"})
   }else{
     
    const randomNumber=crypto.randomInt(0,10000)
    const OTP =String(randomNumber).padStart(4, '5');

    const resetToken = jwt.sign({email,OTP}, process.env.JWT_SECRECT);

  
    const emailProvider = nodeMailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465, // gmail by default port is 465
      auth: {
        user: "shanukumar7988@gmail.com",
        pass:"qoddpqeklnzuluyd", // fir apko gmail ka password dena hai kuch aisa agr aapke gmail pe 2 step authentication on h to
      },
      tls: { rejectUnauthorized: false },
    });
  
    const receiver = {
      from: "shanukumar7988@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your One Time Password(OTP) is ${OTP}`,
    };
  
    emailProvider.sendMail(receiver, (error, emailResponse) => {
      if (error) {
        res.status(422).json({ message: error });
        console.log(error)
      } else {
        const options = {
          expire:new Date(Date.now()+60 * 1000),
          httpOnly: true,
          secure: true,
        };
        res
          .cookie("resetpassToken",resetToken, options)
          .status(200)
          .json({message:"OTP send on your Email Address"})
      }
    });
 
   }
}

const otpverification=async(req,res)=>{
  const{otp}=req.body
  const userOtp=req.cookies.resetpassToken
  if(!userOtp){
    res.status(422).json({message:"token expired"})
  }else{
    const user=jwt.verify(userOtp, process.env.JWT_SECRECT)
    const checkOtp=user.OTP
    if(checkOtp===otp){
      res.status(200).json({message:"Otp verified"})
    }else{
      res.status(422).json({message:"Invalid otp"})
    }
  }
  
}
 
const changepassword=async(req,res)=>{
  const{password}=req.body

  const hashPassowrd = await bcrypt.hash(password, 10);

  const resetToken=req.cookies.resetpassToken

  if(!resetToken){
    res.json({message:"Token Expired"}).status(422)
  }else{
    const checkToken = jwt.verify(resetToken, process.env.JWT_SECRECT);
    
    const email=checkToken.email
    if(!email){
      res.json(422).json({message:"Email is not verified"})
    }else{
      
      const user=await userModel.findOne({email})
      user.password=hashPassowrd
      await user.save()
      res
      .clearCookie("resetpassToken")
      .status(200)
      .json({message:"Password has been changed"})
    }
  }
}

const awsuserProfile=async(req,res)=>{
  const{file}=req.file
  console.log(file)
}


export {
  registerUser,
  loginUser,
  userHome, 
  loggedOut,
  taskData,
  getTaskData,
  deleteTask,
  CompletedTaskUpdate,
  // sendEmail,
  mainTask,
  completedTask,
  incompletedTask,
  userProfile,
  setUserProfile,
  removeUserProfile,
  EmailVerification,
  changepassword,
  otpverification,
  awsuserProfile,
};
