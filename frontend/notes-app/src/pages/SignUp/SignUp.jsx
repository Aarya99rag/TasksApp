import React, { useState } from "react";
// import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!validateEmail) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");

    //Signup api call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle successful registration response
      // if(response.data && response.data.error){
      //   setError(response.data.message)
      //   return
      // }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occured. Please try again");
      }
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <body className="bg-gradient-to-r p-8 animate-gradient-shift h-screen">
        <div className="flex items-center justify-center mt-28">
          <div className="w-96 border rounded bg-white bg-opacity-0 px-7 py-10">
            <form onSubmit={handleSignUp}>
              <h4 className="text-2xl mb-7 text-white">SignUp</h4>

              <input
                type="text"
                placeholder="Name"
                className="input-box bg-white bg-opacity-10 text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Email"
                className="input-box bg-white bg-opacity-10 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

              <button type="submit" className="btn-primary">
                Create Account
              </button>
              <p className="text-sm text-center text-white mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </body>
    </>
  );
};

export default SignUp;
