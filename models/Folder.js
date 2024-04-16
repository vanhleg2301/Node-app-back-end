import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Folder = mongoose.model("folders", folderSchema);
export default Folder;
