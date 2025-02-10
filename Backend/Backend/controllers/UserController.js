import { User } from "../Model/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Function to generate access and refresh tokens for a user
const generateAccessAndRefreshToken = async (userId) => {
  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Generate access and refresh tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Store refresh token in user document
  user.refreshToken = refreshToken;
  
  // Save user without validation checks
  await user.save({ validateBeforeSave: false });

  // Return the generated tokens
  return { accessToken, refreshToken };
};


// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  // Extract user input from request body
  const { fullName, email, password } = req.body;

  // Validate input fields
  if (![fullName, email, password].every((field) => field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the user already exists
  const existUser = await User.findOne({ email });

  if (existUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Create a new user
  const user = await User.create({ fullName, email, password });

  // Retrieve the created user excluding sensitive fields
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // Send success response with user details
  res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully!"));
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body;

  // Validate email and password fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Verify password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password!");
  }

  // Generate new access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  // Retrieve user details excluding sensitive fields
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // Set HTTP-only cookie options for security
  const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

  // Send response with tokens and user data
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

// Refresh access token using refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Retrieve refresh token from cookies or request body
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request!");
  }

  try {
    // Verify refresh token
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user by decoded token ID
    const user = await User.findById(decodedToken?._id);

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token!");
    }

    // Generate new tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // Set HTTP-only cookies
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

    // Send response with new tokens
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token!");
  }
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  // Retrieve all users from the database
  const users = await User.find();

  if (!users.length) {
    throw new ApiError(404, "No users found");
  }

  // Send response with user list
  res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
});


// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    // Check if the user exists
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }
  
    // Remove refresh token from the database
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  
    // Clear authentication cookies
    res
      .status(200)
      .clearCookie("accessToken", { httpOnly: true, secure: true }) // Always secure
      .clearCookie("refreshToken", { httpOnly: true, secure: true }) // Always secure
      .json(new ApiResponse(200, null, "User logged out successfully"));
  });



// Export controller functions
export { registerUser, loginUser, getAllUsers, refreshAccessToken, logoutUser };
