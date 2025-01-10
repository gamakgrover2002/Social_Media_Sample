import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Not authorized, token is required", 401);
  }

  const token = authHeader.split(" ")[1].trim();
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_EXPIRY_SECRET);
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  req.user = user;
  console.log(user, "user");
  next();
});
