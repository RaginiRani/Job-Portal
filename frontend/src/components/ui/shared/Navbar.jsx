import React from "react";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User2, LogOut } from "lucide-react";
import { Button } from "../button";
import { Link } from 'react-router-dom';


const Navbar = () => {
    const user = false;
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        <div>
          <h1 className="text-2xl font-bold">
            Job <span className="text-red-500">Portal</span>
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium text-xl items-center gap-7">
            <li>Home</li>
            <li>Jobs</li>
            <li>Browser</li>
          </ul>
            {
                !user?(
                    <div className="flex items-center gap-3">
                      <Link to="/login"><Button className = 'font-medium' variant="outline">Login</Button></Link>
                      <Link to="/signup"><Button className= "bg bg-purple-600 hover:bg-purple-900">SignUp</Button></Link> 
                    </div>
                ) : (
                    <Popover>
            <PopoverTrigger asChild>
              <Avatar className='cursor-pointer'>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div>
                    <div className="flex gap-2 space-y-2">
                        <Avatar className='cursor-pointer'>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
                        </Avatar>
                        <div>
                            <h4 className="font-medium">Ragini MernStack</h4>
                            <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet.</p>
                        </div>
                    </div>
                    <div className="flex flex-col my-2 gap-4 text-gray-600">
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                            <User2/>
                            <button variant="link">View Profile</button>
                        </div>
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                            <LogOut/>
                            <button variant="link">LogOut</button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
          </Popover>
                )
            }
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;
