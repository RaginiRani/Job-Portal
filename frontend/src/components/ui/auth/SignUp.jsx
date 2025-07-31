import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { RadioGroup} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice.js';
import { Loader2 } from 'lucide-react';


const SignUp = () => {
  const [input, setInput] = useState({
    fullname:"",
    email:"",
    phoneNumber:"",
    password:"",
    role:"",
    file:""
  });
  const {loading} = useSelector(store=>store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({...input, [e.target.name]:e.target.value});
  }
  const changeFileHandler = (e) => {
    setInput({...input, file:e.target.files?.[0]});
  }
  const SubmitHandler = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if(input.file){
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers:{
          "Content-Type":"multipart/form-data"
        },
        withCredentials:true
      })
      if(res.data.success){
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
        console.error(error); // This helps you see the real error in the console
        const message = error?.response?.data?.message || "Something went wrong. Please try again.";
        toast.error(message);
    }  finally{
            dispatch(setLoading(false));
          }

  }
  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        <form onSubmit={SubmitHandler} className='w-1/2 border border-gray-400 rounded-md p-6 my-10 shadow-sm'>
          <h1 className='font-bold text-2xl mb-6'>Sign Up</h1>

          <div className='flex flex-col gap-4 mb-4'>
            <Label className="text-md font-medium text-gray-700">Full Name</Label>
            <input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder='Ragini'
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400'
            />
          </div>
          <div className='flex flex-col gap-4 mb-4'>
            <Label className="text-md font-medium text-gray-700">Email</Label>
            <input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder='abc@mail.com'
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400'
            />
          </div>
          <div className='flex flex-col gap-4 mb-4'>
            <Label className="text-md font-medium text-gray-700">Phone Number</Label>
            <input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder='Ragini'
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400'
            />
          </div>
          <div className='flex flex-col gap-4 mb-4'>
            <Label className="text-md font-medium text-gray-700">Password</Label>
            <input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder='brgi754@9h'
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400'
            />
          </div>
          <div className='flex items-center justify-between'>
            <RadioGroup className='flex items-center gap-4 my-5'>
              <div className="flex items-center space-x-2">
                <input
                type="radio"
                name="role"
                value="student"
                checked={input.role === 'student'}
                onChange={changeEventHandler}
                className="cursor-pointer"
                />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                type="radio"
                name="role"
                value="recruiter"
                checked={input.role === 'recruiter'}
                onChange={changeFileHandler}
                className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className='flex items-center gap-2'>
              <Label>Profile</Label>
              <input accept='image/*'
              type="file"
              onChange={changeEventHandler}
              className='cursor-pointer'
              />
            </div>
          </div>
          {
            loading ? <button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please Wait</button> : <button type="submit" className="bg-black text-white text-md py-2 w-full my-4">SignUp</button>
          }
          <span className='text-sm'>
             Already Have an Account?{" "}
            <Link to="/login" className="text-blue-600 underline">Login</Link>
          </span>

        </form>
      </div>
    </div>
  )
}

export default SignUp
