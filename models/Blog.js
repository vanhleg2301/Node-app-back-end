import mongoose, { Schema } from "mongoose";
import { Types } from "mongoose";

const BlogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
  },
  content: {
    type: String,
  },
});

const Blog = mongoose.model("blogs", BlogSchema);

export default Blog;
