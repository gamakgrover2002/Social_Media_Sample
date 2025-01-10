import mongoose from "mongoose";

const connectDb =  async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGO_URL}`,
    
    );

  } catch (e) {
    throw new Error(`Database connection failed: ${e.message}`);
  }
};

export { connectDb};
