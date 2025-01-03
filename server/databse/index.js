import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://gamakgrover:uRyVZtrtsXFyr60y@cluster0.dzlzij5.mongodb.net/",
    
    );

  } catch (e) {
    throw new Error(`Database connection failed: ${e.message}`);
  }
};

export { connectDb};
