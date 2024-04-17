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
  displayName: {
    type: String,
  },
  photoURL: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  // authorId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "folders",
  // },
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "blogs",
  // },
  accessToken: {
    type: String,
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
