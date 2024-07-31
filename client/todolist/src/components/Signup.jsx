import axios from "axios";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Signup = () => {
  const redirect = useNavigate();

  const [userdata, setUserdata] = useState({
    username: "",
    email: "",
    password: "",
  });

  // const[err,setErr]=useState("")

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserdata({ ...userdata, [name]: value });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const serverResponse = await axios.post("/user/register", userdata);
      toast.success(serverResponse.data.message);
      redirect("/login");
    } catch (error) {
      console.log("Server Connection Failed ! ", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ x: -600, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 1 }}
        style={{ backgroundColor: "rgba(220, 221, 225,1.0)" }}
        className="flex h-[100vh] k flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-12 w-auto"
            src="https://www.pngkey.com/png/full/203-2035339_register-user-register-online-icon-png.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Task Manager Registration
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2 ">
                <input
                  id="email"
                  name="username"
                  value={userdata.username}
                  onChange={handleChange}
                  type="text"
                  autoComplete="email"
                  required
                  className="block p-2  w-full outline-none rounded-md  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
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
                  className="block w-full p-2 outline-none rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={userdata.password}
                  onChange={handleChange}
                  type="text"
                  autoComplete="current-password"
                  required
                  className="block w-full p-2 outline-none rounded-md  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={handleClick}
                className="flex w-full p-2 justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create new account
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account{" "}
            <NavLink
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              login
            </NavLink>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Signup;
