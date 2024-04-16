import mongoose, { Schema } from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    folderId: {
      type: Schema.Types.ObjectId, // Thay đổi kiểu dữ liệu của folderId
      ref: "folders",
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("notes", noteSchema);
export default Note;
