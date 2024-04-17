import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    content: {
      type: String,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "folders",
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("notes", noteSchema);
export default Note;
