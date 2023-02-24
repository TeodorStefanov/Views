import mongoose, { Schema, model, models } from "mongoose";
const notificationSchema = new Schema({
  sentBy: {
    type: "ObjectId",
    ref: "User",
    required: true,
  },
  sentTo: {
    type: "ObjectId",
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
    required: true,
  },
  pressed: {
    type: Boolean,
    default: false,
    required: true,
  },
});
const Notification =
  models.Notification || model("Notification", notificationSchema);
export default Notification;
