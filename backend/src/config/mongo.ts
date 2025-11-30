import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI as string;

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export default connectDB;
