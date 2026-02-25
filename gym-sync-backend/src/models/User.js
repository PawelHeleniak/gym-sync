import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  emailChangeCode: { type: String },
  emailChangeCodeExpires: { type: Date },
  pendingEmail: { type: String },
});

const User = mongoose.model("User", userSchema);
export default User;
