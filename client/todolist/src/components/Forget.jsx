import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {BeatLoader} from "react-spinners"

import { FaLongArrowAltRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom";

const Forget = () => {
  const[loading,setLoading]=useState(false)
    const redirect=useNavigate()
    const[data,setData]=useState({
        email:"",
    })

    const handleChange=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setData({...data,[name]:value})
    }

    const resetPassword=async()=>{
        try {
             setLoading(true)
            const response=await axios.post("/user/resetpassword",data)
            setLoading(false)
             toast.success(response.data.message)
             
             redirect("/otp")
        } catch (error) {
            console.log("Login Connection Failed",error)
            if(axios.isAxiosError(error)){
              toast.error(error.response.data.message)
            }
        }
    }
  return (
    <>
      <div className="w-full h-[100vh] items-center  flex justify-center" style={{backgroundColor:"#F6F5F5"}}>
          <motion.div 
          initial={{y:-300,opacity:0}}
          animate={{y:0,opacity:1}} 
          transition={{ease:"easeInOut",duration:1}}
          className="w-[25rem]  shadow-xl rounded-lg
           h-[10rem] p-2 flex flex-col" style={{ backgroundColor: "rgba(220, 221, 225,1.0)" }}>
             <h1 className="text-center text-[1.5rem] outline-none">Forget Password</h1>
             <label>Email</label>
             <input onChange={handleChange} name="email" value={data.email} className="w-[100%] border-none outline-none p-2 h-8" placeholder="Enter Your Email Address" type="text"/>
             <button onClick={resetPassword} className="w-full my-2 h-10 bg-green-500 text-white">{loading ? <BeatLoader size={13} color="white" /> :"Next"}</button> 
          </motion.div>
      </div>
    </>
  );
};
export default Forget;