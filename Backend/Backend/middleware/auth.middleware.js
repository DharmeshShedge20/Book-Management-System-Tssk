import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Model/userModel.js";

// Middleware to verify JWT and authenticate user
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request"); // Reject request if token is missing
        }
    
        let decodedToken;
        try {
            // Verify token using the secret key
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            return next(new ApiError(401, "Invalid or expired access token")); // Handle token verification failure
        }

        // Fetch user from the database and exclude password & refresh token fields
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if (!user) {
            throw new ApiError(401, "Invalid access token"); // Handle case where user does not exist
        }

        req.user = user; // Attach user object to request for further processing
        return next(); // Move to the next middleware or controller
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token"); // Catch and handle unexpected errors
    }
});
