import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";



const register = asyncHandler(async (req, res) => {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            throw new ApiError(400, "Something is Missing");
        };
        
        const user = await User.findOne({ email });
        if (user) {
            throw new ApiError(400, 'User already exist with this email.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
})
const login = asyncHandler(async (req, res) => {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            throw new ApiError(400, "Something is missing")
        };
        let user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(400, "Incorrect email or password.")
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new ApiError(400, "Incorrect email or password.")
        };
        // check role is correct or not
        if (role !== user.role) {
            throw new ApiError(400, "Account doesn't exist with current role.")
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname} you loggedIn successfully`,
            user,
            success: true
        })
}

)
const logout = asyncHandler(async (req, res) => {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
})
const updateProfile = asyncHandler(async (req, res) => {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const file = req.file;
        // cloudinary ayega idhar

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            throw new ApiError(400, "User not found.")
        }
        // updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
      
        // resume comes later here...
        
        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
}

)

export {
    register,
    login,
    logout,
    updateProfile
}