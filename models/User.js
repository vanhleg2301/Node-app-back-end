import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    uid: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is not blank"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
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
  },
  { timestamps: true }
);

const User = mongoose.model("users", UserSchema);

export default User;
