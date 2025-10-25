import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("Połączono z MongoDB");
  } catch (err) {
    console.error("Błąd połączenia z MongoDB:", err.message);
    process.exit(1);
  }
};

export default connectDB;
