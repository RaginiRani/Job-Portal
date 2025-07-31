
import React,{useState} from 'react'
import Navbar from '../shared/Navbar.jsx'
import { RadioGroup} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice.js';
import { Loader2 } from 'lucide-react';


const Login = () => {
  const [input, setInput] = useState({
      email:"",
      password:"",
      role:""
  });
  const {loading} = useSelector(store=>store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({...input, [e.target.name]:e.target.value});
  }
  
  const SubmitHandler = async(e) => {
      e.preventDefault();
      if (!input.email || !input.password || !input.role) {
      toast.error("Please fill in all fields including role.");
      return;
    }
      try {
        dispatch(setLoading(true));
        const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
          headers:{
            "Content-Type":"application/json"
          },
          withCredentials:true
        })

        if(res.data.success){
          navigate("/");
          toast.success(res.data.message);
        }
      } catch (error) {
              console.error(error); // This helps you see the real error in the console
              const message = error?.response?.data?.message || "Something went wrong. Please try again.";
              toast.error(message);
      } finally{
        dispatch(setLoading(false));
      }
    }
  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        <form onSubmit={SubmitHandler} className='w-1/2 border border-gray-400 rounded-md p-6 my-10 shadow-sm'>
          <h1 className='font-bold text-2xl mb-6'>Login</h1>

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
                value="student"
                checked={input.role === 'recruiter'}
                onChange={changeEventHandler}
                className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
            
          </div>
          {
            loading ? <button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please Wait</button> : <button type="submit" className="bg-black text-white text-md py-2 w-full my-4">Login</button>
          }
          
          <span className='text-sm'>
             Dont Have an Account?{" "}
            <Link to="/signup" className="text-blue-600 underline">SignUp</Link>
          </span>

        </form>
      </div>
    </div>
  )
}

export default Login

