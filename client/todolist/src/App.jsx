import React, { useEffect, useState } from "react";
import "./App.css";
import Signup from "./components/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Home from "./components/Home";
import AllTasks from "./components/AllTasks";
import CompletedTask from "./components/CompletedTask";
import IncompletedTask from "./components/IncompletedTask";
import Forget from "./components/Forget"
import axios from "axios";
import Reset from "./components/Reset";
import Otp from "./components/Otp";


function App() {
  // const[task,setTask]=useState()
  // const[taskdata,setTaskData]=useState({
  //   title:"",
  //   description:"",
  //   color:""
  // })

  const handleClick=async(e)=>{
    e.preventDefault();
    try {
      const response=await axios.post("/user/task",taskdata)
      console.log(response)
      toast.success(response.data.message)
      Removeoverlay()
      // getTaskData()
    } catch (error) {
      if(axios.isAxiosError(error)){
        toast.error(error.response.data.message)
      }  
    }
  }

  const getTaskData=async()=>{
    try {
      const response=await axios.get("/user/tasks")
       setTask(response.data.user.tasks)
    } catch (error) {
      
    }
  }

  useEffect(()=>{
   getTaskData()
  },[])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/forgetPassword" element={  <Forget/>}/>
          <Route path="/otp" element={  <Otp/>}/>
          <Route path="/resetPassword" element={  <Reset/>}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />}>
            <Route index element={<AllTasks  />} />
            <Route path="/completedTask" element={<CompletedTask />} />
            <Route path="/incompletedTask" element={<IncompletedTask />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={1500} />
    </>
  );
}

export default App;
