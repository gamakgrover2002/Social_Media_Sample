import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import dotenv from "dotenv"

dotenv.config({
  path:"../.env"
});

const generateTokens = async (user, res) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie("access_token", accessToken);
    res.cookie("refresh_token", refreshToken);
    user.refreshToken = refreshToken;
    await user.save();
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new Error("Error generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password, adminPasskey } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    const userExists = await User.findOne({ $or: [{ email }, { userName }] });
    if (userExists) {
      return res.status(400).send("User already exists");
    }
    let role = "user";
    if (adminPasskey) {
      if (adminPasskey === process.env.ADMIN_PASSKEY) {
        role = "admin";
      }
    }
    const newUser = await User.create({
      userName,
      email,
      password,
      events: [],
      role,
    });

    await generateTokens(newUser, res);
    
    return res
      .status(201)
      .send("User successfully created");
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).send("userName and password are required");
  }
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    }
    await generateTokens(user, res);

    return res.status(200).send("Login successful");
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {

  const incomingToken =  req.body.refreshToken;

  if (!incomingToken) {
    throw new ApiError(401, "No token provided");
  }
  try {
    const decodedToken = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_EXPIRY_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid token");
    }
    if (user.refreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid Refresh token");
    }
    await generateTokens(user, res);
    res.status(200).send("Access and Refresh tokens generated");
  } catch (err) {
    console.error(err);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const accessId = req.user._id.toString();

  await User.findByIdAndUpdate(accessId, {
    $set: {
      refreshToken: "",
    },
  });
  return res
    .status(200)
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .send("Logout success");
});
export {
  generateTokens,
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
