import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema(
  {
    src: {
      type: String,
      required: true,
    },
    imageData: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

const Image = mongoose.model("images", imageSchema);
export default Image;
