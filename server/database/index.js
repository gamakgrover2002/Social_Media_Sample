import mongoose from "mongoose";
import { DATABASE_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGO_URL}/${DATABASE_NAME}`,
    
    );

  } catch (e) {
    throw new Error(`Database connection failed: ${e.message}`);
  }
};

export { connectDb};
