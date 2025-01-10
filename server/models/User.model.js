import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
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
    minlength: 8
  },
  displayName:{
    type: String,
    required: true,
    trim: true
  },
  role:{
    type: String,
    required: true,
    enum: ["user", "admin"]
  },
  events:[{
      type: Schema.Types.ObjectId,
      ref: "Event"
  }],

},{
  timestamps:true
}
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

export const User = mongoose.model("User", userSchema);
