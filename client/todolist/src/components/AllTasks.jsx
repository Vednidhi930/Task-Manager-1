import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { GoHeart } from "react-icons/go";
import { PiNotePencilBold } from "react-icons/pi";
import { IoAdd } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

import { IoMdHeart } from "react-icons/io";
import "../App.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllTasks = ({}) => {
  const redirect = useNavigate();
  const [like, setLike] = useState(true);
  const [selectId, setSelectId] = useState("");
  const[task,setTask]=useState()
  const[updateData,setUpdateData]=useState({
    id:"",
    title:"",
    description:"",
    date:""
  })
  const[taskdata,setTaskData]=useState({
    title:"",
    description:"",
    date:""
  })

  const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setTaskData({...taskdata,[name]:value})
  }

  const handleClick=async(e)=>{
    e.preventDefault();
    try {
      if(!taskdata.title){
        toast.error("Fill the title field")
      }else if(!taskdata.description){
        toast.error("Fill the description field")
      }else if(!taskdata.date){
        toast.error("Fill the date field")
      }else{
        const response=await axios.post("/user/task",taskdata)
        toast.success(response.data.message)
        Removeoverlay()
        setTaskData({ title:"",
          description:"",
          color:""})
      }
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
  },[handleClick])

  const handleDelete=async(id)=>{
    const response=await axios.delete(`/user/delete/${id}`)
    toast.success(response.data.message)
  }

  const handleCompleteTask=async(id)=>{
    const response=await axios.put(`/user/update/${id}`)
    toast.success(response.data.message)
  }
 
  const AddOverlay=()=>{
    const overlay=document.getElementById("blackoverlay")
    overlay.classList.add("overlay_show")
  }

  const Removeoverlay=()=>{
    const overlay=document.getElementById("blackoverlay")
    overlay.classList.remove("overlay_show")
    setUpdateData({id:"",title:"",description:""})
  }

  const handleUpdateTask=async(id,title,description,date)=>{
    setUpdateData({id:id,title:title,description:description,date:date})
    AddOverlay()
  }

  useEffect(()=>{
    setTaskData({title:updateData.title,description:updateData.description})
  },[updateData])

  const handleClickUpdate=async(e)=>{
    e.preventDefault();
    try {
      const response=await axios.put(`/user/mainTask/update/${updateData.id}`,taskdata)
      toast.success(response.data.message)
      Removeoverlay()
      setUpdateData({ 
        id:"",
        title:"",
        description:"",
        date:"",
        })
        setTaskData({ title:"",
          description:"",
          date:""})
      // getTaskData()
    } catch (error) {
      if(axios.isAxiosError(error)){
        toast.error(error.response.data.message)
      }  
    }
  }

  // const handleColor=(elementId)=>{
  //  const taskLabel=document.getElementById(elementId)
  //  console.log(taskLabel)
  //  const taskName=document.getElementById("taskName")
  //  const taskDescription=document.getElementById("taskDescription")
  //  const taskColor=document.getElementById("taskColor")
  //  const input1=document.getElementById("input1")
  //  const input2=document.getElementById("input2")
  //  const input3=document.getElementById("color")
  //  if(elementId==="taskName"){
  //   taskName.style.color="red"
  //   input1.style.borderColor="red"
  //  }else if(elementId==="color"){
  //    taskColor.style.color=taskdata.color
  //    input3.style.borderColor=taskdata.color
  //  }else{
  //    taskDescription.style.color="purple"
  //   input2.style.borderColor="purple"
  //  }
  // }


  const handleSearchBar=(e)=>{
    console.log(e.target.value)
  }


  return (
    <>
      <div className="flex justify-around my-2 relative  items-center w-full h-12" style={{backgroundColor:"rgba(245, 246, 250,1.0)"}}>
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          className="text-2xl my-2  p-1 "
        >
          All Tasks
        </motion.h1>

        <motion.div
          className="p-6 my-1"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Search Your Task"
            className="w-[18rem] text-sm p-2 rounded-full"
            onChange={handleSearchBar}
          />
        </motion.div>

        <motion.div
          title="Add Task"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          className="w-8 h-8 rounded-full flex justify-center items-center border border-black"
        >
          <IoAdd className="text-[1.5rem]" onClick={AddOverlay}/>
        </motion.div>
      </div>

      <div className="w-full justify-center flex flex-wrap">
        {!task ? null:task.map((curr, id) => (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.8 }}
            style={{ boxShadow: "6px 6px 10px grey" }}
            key={id}
            className="w-80 h-44 bg-white rounded-lg full flex flex-col   gap-3  my-7 ms-5 relative"
          >
            <div
             
              className={`w-full cursor-pointer flex justify-center items-center text-white h-10 ${
                curr.completed ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <h1  onClick={()=>handleCompleteTask(curr._id)}>{curr.completed ? "Complete" : "Incomplete"}</h1>
              <div className="w-[70%] flex justify-end items-center gap-2">
                {/* <IoMdHeart onClick={()=>handleLike(id)} className={`text-2xl ${like ? "text-red-600":"text-white"}`}/>  */}
                <PiNotePencilBold className="text-2xl" onClick={()=>handleUpdateTask(curr._id,curr.title,curr.description,curr.date)}/>
                <MdOutlineDeleteOutline className="text-2xl" onClick={()=>handleDelete(curr._id)}/>
              </div>
            </div>  

            <div
              className={`text-wrap w-full h-10 p-2 text-blue-500  text-[1.3rem] rounded-full  flex`}
            >
              <h1>{curr.title}</h1>
            </div>

            <div className="w-[100%] capitalize p-2 text-lg flex font-sans text-wrap">
              <h1 className="">{curr.description}</h1>
            </div>

            <h1 className="ms-2 text-center  text-red-500">Due date-{curr.taskdate}</h1>
            
            {/* <div className="w-16 overflow-hidden  h-16 rounded-full flex justify-center items-center">
            <img
                className="bg-contain"
                src={profile}
                alt="image"
              />
            </div> */}

          </motion.div>
        ))}

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.8 }}
          style={{ boxShadow: "6px 6px 10px grey" }}
          className="w-80 h-44 bg-white rounded-lg full flex flex-col gap-3  ms-5 my-7 relative"
          onClick={AddOverlay}
        >
          <div className="w-full h-full flex justify-center items-center flex-col">
            <IoAdd className="text-[5rem]"/>
            <h1>Add Task</h1>
          </div>
        </motion.div>
      </div>

    <div
        id="blackoverlay"
        className="w-[79.7vw] overlay_hide  h-[100%] rounded-lg"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      >
        <form className=" w-full h-full flex justify-center items-center">
          <div className="w-[20rem] flex flex-col p-3 gap-3 h-[22rem] rounded-lg relative bg-white">
            <h1 className="text-center text-2xl">Create new task</h1>
            <RxCross2 className="absolute top-0 text-3xl right-0 " onClick={Removeoverlay}/>
            <div className="flex flex-col gap-1">
              <label className="text-sm" id="taskName">Task Name</label>
              <input onClick={()=>handleColor("taskName")} id="input1" type="text" name="title" value={taskdata.title} className="border border-black outline-none p-1 font-serif h-8 rounded-lg" onChange={handleChange}/>
            </div>

            <div className="flex flex-col ga`p-1">
              <label className="text-sm" id="taskDescription">Task Description</label>
              <textarea onClick={()=>handleColor("taskDescription")} id="input2" className="border p-1 font-serif border-black outline-none h-20" name="description" value={taskdata.description} maxLength={100} onChange={handleChange}></textarea>
              {/* <input type="text" name="task_name" className="border border-black" /> */}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="date">Task Date</label>
              <input type="date" id="date" className="border border-black p-1" onChange={handleChange} name="date" value={taskdata.date}/>
              {/* <select onClick={()=>handleColor("color")} name="color" id="color" value={taskdata.color} onChange={handleChange} className="w-[30%] p-1 font-serif border text-sm h-7 outline-none border-black">
                <option value="red">red</option>
                <option value="black">black</option>
                <option value="blue">blue</option>
                <option value="green">green</option>
                <option value="purple">purple</option>
                <option value="yellow">yellow</option>
                <option value="orange">orange</option>
              </select> */}
              {/* <input type="text" name="task_name" className="border border-black h-8 rounded-md" /> */}
            </div>
          {!updateData.id ?  <button className="w-full h-10 bg-blue-600 text-white" onClick={handleClick}>Add Task</button> : <button className="w-full h-10 bg-blue-600 text-white" onClick={handleClickUpdate}>Update Task</button>}
          </div>
        </form>
      </div>
    </>
  );
};

export default AllTasks;
