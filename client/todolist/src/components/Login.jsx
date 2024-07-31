import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {motion} from "framer-motion"
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";

const Login = () => {


     const redirect=useNavigate() 
     const[eye,setEye]=useState(true)
     const[otp,setOtp]=useState("")
     const[count,setCount]=useState(10)

    const[userdata,setUserdata]=useState(
        {
            email:"",
            password:"",
        }
    )
    

    const handleChange=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setUserdata({...userdata,[name]:value})
    }

    const handleClick=async(e)=>{
        e.preventDefault()
        
        try {
            const response=await axios.post("/user/login",userdata)
             toast.success(response.data.message)
             redirect("/")
        } catch (error) {
            console.log("Login Connection Failed",error)
            if(axios.isAxiosError(error)){
              toast.error(error.response.data.message)
            }
        }
    }

    // const sendEmail=async()=>{
    //   try {
    //     const response=await axios.get("/user/email")
    //     setOtp(response.data.message)
    //     toast.success(response.data.message)
    //   } catch (error) {
    //     if(axios.isAxiosError(error)){
    //       toast.error(error.response.data.message)
    //     }
    //   }
    // }

   
    // const handleCount=()=>{

    //   count<=0 ? 0 : setCount(count-1)
     
    // }


  // Use useEffect to set up the interval and clean it up
  // useEffect(() => {
  //     const intervalId = setInterval(() => {
  //         handleCount(); // Call handleCount every minute (every 1000ms * 60 = 60000ms)
  //     }, 1000);

  //     // Clean up the interval to avoid memory leaks
  //     return () => clearInterval(intervalId);
  // }, [handleCount]);
    

    

  return (
    <>
         <motion.div initial={{x:-600,opacity:0}}
          animate={{x:0,opacity:1}} 
          transition={{ease:"easeInOut",duration:1}} 
           style={{backgroundColor:"rgba(220, 221, 225,1.0)"}}
            className="flex h-[100vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-16 w-auto"
            src="https://cdn-icons-png.flaticon.com/512/272/272354.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Task Manager Login
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  value={userdata.email}
                  onChange={handleChange}
                  type="text"
                  autoComplete="email"
                  required
                  className="block p-2 outline-none w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>



            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm flex gap-1">
                  <Link to="/forgetPassword" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password
                  </Link> 
                </div>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  value={userdata.password}
                  onChange={handleChange}
                  type={eye ? "password" : "text"}
                  autoComplete="current-password"
                  required
                  className="block outline-none w-full p-2  rounded-md  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {eye ? <IoEyeSharp onClick={()=>setEye(!eye)} className="absolute text-lg top-2 right-1"/> :<BsEyeSlashFill onClick={()=>setEye(!eye)} className="absolute text-lg top-2 right-1"/> }
              </div>
            </div>
            <div>
              <button
                type="submit"
                onClick={handleClick}
                className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                login
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account{' '}
            <NavLink to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              signup
            </NavLink>
          </p>
        </div>
      </motion.div>
    </>
  )
}

export default Login
