import mongoose, { Schema } from "mongoose";

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.Mixed,
      ref: "users",
    },
  },
  { timestamps: true }
);

const Folder = mongoose.model("folders", folderSchema);
export default Folder;
