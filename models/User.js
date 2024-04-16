import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is not blank"],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: "blogs",
  },
  refreshToken: {
    type: String,
  },
  role: {
    type: String,
  },
});

const User = mongoose.model("users", UserSchema);

export default User;
