import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new ApiError(401, "User not authenticated");
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            throw new ApiError(401, "Invalid Token");
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            success: false,
            message: error.message || "Unauthorized",
        });
    }
};

export default isAuthenticated;
