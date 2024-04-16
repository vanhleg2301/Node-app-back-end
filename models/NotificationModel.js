import mongoose from "mongoose";

const notficationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("notification", notficationSchema);
export default NotificationModel;
