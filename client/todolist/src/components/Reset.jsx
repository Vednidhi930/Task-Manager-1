import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Reset = () => {

    const redirect=useNavigate()
    const[data,setData]=useState({
        password:"",
    })

    const handleChange=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setData({...data,[name]:value})
    }

    
    const resetPassword=async()=>{
        try {
            const response=await axios.post("/user/changepassword",data)
             toast.success(response.data.message)
             redirect("/login")
        } catch (error) {
            console.log("Login Connection Failed",error)
            if(axios.isAxiosError(error)){
              toast.error(error.response.data.message)
            }
        }
    }

  return (
    <>
         <div className="w-full h-[100vh] bg-white items-center flex justify-center" style={{backgroundColor:"#F6F5F5"}}>
          <motion.div 
          initial={{y:-300,opacity:0}}
          animate={{y:0,opacity:1}} 
          transition={{ease:"easeInOut",duration:1}}
          className="w-[25rem] shadow-xl rounded-lg h-[10rem]  p-2 flex flex-col" style={{ backgroundColor: "rgba(220, 221, 225,1.0)" }}>
             <h1 className="text-center text-[1.5rem] outline-none">Reset Password</h1>
             <label>Password</label>
             <input onChange={handleChange} name="password" value={data.password} className="w-[100%] border-none outline-none p-2 h-8" placeholder="Enter new password" type="text"/>
             <button onClick={resetPassword} className="w-full my-2 h-10 bg-green-500 text-white">Reset Password</button>
          </motion.div>
      </div>
    </>
  )
}

export default Reset
