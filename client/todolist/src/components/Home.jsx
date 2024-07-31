import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import AllTasks from "./AllTasks";

const Home = () => {
  const redirect = useNavigate();
  const [user, setUser] = useState("");

  const getdata = async () => {

    try {
      const response = await axios.get("/user");
      setUser(response.data.user);
      if (response.ok) {
        redirect("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        redirect("/login");
      }
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  

  const handleClick = async () => {
    try {
      const response = await axios.get("/user/logout");
      toast.success(response.data.message);
      redirect("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("some error occured");
      }
    }
  };

  return (
    <>
    <div className="flex gap-2 p-2 m-1" >
      <Sidebar handleClick={handleClick} user={user}/>
      <div className="w-[100vw] rounded-lg  flex flex-col  border border-black" style={{backgroundColor:"rgba(245, 246, 250,1.0)"}}>
        <Outlet handleClick={handleClick} user={user}/>
      </div>
      </div>
    </>
  );
};

export default Home;
