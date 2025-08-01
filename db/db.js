import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.name}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectToDb;
