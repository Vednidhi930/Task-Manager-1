import React, { useEffect, useRef, useState } from "react";
import { MdOutlineAllInclusive } from "react-icons/md";
import { IoMdCloudDone } from "react-icons/io";
import { MdIncompleteCircle } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { ClockLoader } from "react-spinners";
import {FadeLoader}  from "react-spinners"
import { AiOutlineCopyright } from "react-icons/ai";

const Sidebar = ({ handleClick, user }) => {
  const [profile, setProfile] = useState("");
  const [loader, setLoader] = useState(false);
  const[removeProfile,setRemoveProfile]=useState(false)
  const handleRef = useRef(null);

  const [time, setTime] = useState(new Date().toLocaleTimeString());

  const updateTime = () => {
    const currentTime = new Date().toLocaleTimeString();
    setTime(currentTime);
  };

  setInterval(updateTime, 1000);

  const handleImage = () => {
    handleRef.current.click();
  };

  const handleProfile = (event) => {
    const file = event.target.files[0];
    if (file) {
      sendFile(file);
    }
    setTimeout(() => {
      toast.success("Profile Picture Updated");
      setLoader(true)
    }, 2500);
  };

  const sendFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoader(true)
      await axios.post("/user/profile", formData);
      getdata();
    } catch (erorr) {
      setImmediate(() => {});
      toast.error("upload failed");
    }
  };

  const getdata = async () => {
    const response = await axios.get("/user/profile");
    setLoader(false)
    setProfile(response.data.user.profileImage);
  };

  useEffect(() => {
    getdata();
  }, [handleProfile]);

  const data = [
    {
      category: "All Task",
      icon: <MdOutlineAllInclusive className="text-2xl text-purple-500" />,
      link: "/",
    },
    {
      category: "Completed",
      icon: <IoMdCloudDone className="text-2xl text-green-500" />,
      link: "/completedTask",
    },
    {
      category: "InCompleted",
      icon: <MdIncompleteCircle className="text-2xl text-red-600" />,
      link: "incompletedTask",
    },
  ];


const handleRemoveProfile=async()=>{
  const response =await axios.get("/user/remove/profile")
  setRemoveProfile(false)
  toast.success(response.data.message)
}


  return (
    <>
      <nav className="flex ">
        <motion.div
          initial={{ x: -600, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.6 }}
          style={{ backgroundColor: "rgba(245, 246, 250,1.0)" }}
          className="w-64 h-[100vh]  border flex rounded-lg flex-col gap-10 border-black"
        >
          <div className="w-full h-16 border-b flex justify-center items-center border-black">
            <h1 className="text-[1.2rem] uppercase ">Task Manager</h1>
            <button
              className="border border-black ps-2 pr-2  h-8 ms-10 font-mono bg-red-400 text-sm text-white rounded-full font-bold"
              onClick={handleClick}
            >
              Logout
            </button>

            {/* <BounceLoader size={35}/> */}
          </div>

          <div className="w-full flex justify-center">
            <h1 className="ms-2 text-lg text-red-500">{time}</h1>
          </div>

          <div className="w-full h-40 flex flex-col gap-1 justify-center items-center border-black">
            <div
              onClick={handleImage}
              className="w-20 overflow-hidden  h-20 rounded-full flex justify-center items-center"
            >
              {!loader ? (
                <img className="bg-contain" src={profile} alt="image" />
              ) : (
                <ClockLoader size={30} color="red" />
              )}
            </div>

            <div className="flex flex-col justify-center items-center">
              <p className="text-sm font- flex justify-center font-sans text-wrap">
                {user.email}
              </p>
          {removeProfile ? <button className="w-[8rem] h-[1.7rem] bg-red-400 text-white text-sm border border-black" onClick={handleRemoveProfile}>Remove Profile</button> :null}
            </div>
          </div>

          <div className="w-full h-32 flex flex-col gap-6 cursor-pointer">
            {data.map((curr, i) => (
              <NavLink to={curr.link}>
                <div
                  key={i}
                  className="w-full flex flex-col items-center justify-center gap-2"
                >
                  {curr.icon}
                  <h1>{curr.category}</h1>
                </div>
              </NavLink>
            ))}

            <div className="w-full font-serif my-6 flex justify-center items-center">
              <AiOutlineCopyright className="text-[1.3rem]"/>
              <h1>Task Manger</h1>
            </div>
          </div>
        </motion.div>
      </nav>

      <form encType="multipart/form-data" hidden id="submit">
        <input
          ref={handleRef}
          type="file"
          id="uploadFile"
          name="profile"
          onChange={handleProfile}
        />
      </form>
    </>
  );
};

export default Sidebar;
