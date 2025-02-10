import { User } from "../Model/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Function to generate access and refresh tokens for a user
const generateAccessToken = async (userId) => {
  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Generate access and refresh tokens
  const accessToken = user.generateAccessToken();
  
  // Save user without validation checks
  await user.save({ validateBeforeSave: false });

  // Return the generated tokens
  return { accessToken};
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
  const createdUser = await User.findById(user._id).select("-password");

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
  const { accessToken} = await generateAccessToken(user._id);

  // Retrieve user details excluding sensitive fields
  const loggedInUser = await User.findById(user._id).select("-password");

  // Set HTTP-only cookie options for security
  const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

  // Send response with tokens and user data
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken}, "User logged in successfully"));
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    // Check if the user exists
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }
  
    // Clear authentication cookies
    res
      .status(200)
      .clearCookie("accessToken", { httpOnly: true, secure: true }) // Always secure
      .json(new ApiResponse(200, null, "User logged out successfully"));
  });



// Export controller functions
export { registerUser, loginUser, logoutUser };
