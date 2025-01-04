import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
     friendRequest:[{
        type: Schema.Types.ObjectId,
        ref: "User",
      }],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_EXPIRY_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
  return token;
};
userSchema.methods.generateRefreshToken = async function () {
  //log lived access token
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_EXPIRY_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );

  return token;
};
export const User = mongoose.model("User", userSchema);
