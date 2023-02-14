import mongoose, { Schema, model, models } from "mongoose";
const commentsSchema = new Schema({
  user: {
    type: "ObjectId",
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likes: [
    {
      type: "ObjectId",
      ref: "User",
    },
  ],
  comments: [
    {
      type: "ObjectId",
      ref: "Comments",
    },
  ],
});
const Comments = models.Comments || model("Comments", commentsSchema);
export default Comments;
