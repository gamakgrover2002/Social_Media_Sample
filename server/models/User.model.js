import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const userSchema = new Schema({
  userName:{
    type:String,
    required:true,
    trim:true,
    lowercase:true
  },
  password:{
    type: String,
    required: true,
  },
  role:{
    type: String,

  },
  events:[{
      type: Schema.Types.ObjectId,
      ref: "Event"
  }],
  refreshToken:{
    type: String,
  }

},{
  timestamps:true
}
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});
userSchema.methods.generateAccessToken = async function () {
  //short lived access token
  const accessToken = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_EXPIRY_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return accessToken;
};
userSchema.methods.generateRefreshToken = async function () {
  //log lived access token
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_EXPIRY_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
  return refreshToken;
};
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateForgetPasswordToken = async function(){
  const forgetPasswordToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.FORGET_PASSWORD_TOKEN_SECRET,
    {
      expiresIn: process.env.FORGET_PASSWORD_TOKEN_EXPIRY,
    }
  );
  return forgetPasswordToken;
}


const User = mongoose.model("User", userSchema);

export default User;



