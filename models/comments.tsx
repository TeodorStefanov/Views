import mongoose, { Schema, model, models } from "mongoose";
const commentsSchema = new Schema({
  user: {
    type: "ObjectId",
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
});
const Comments = models.Comments || model("Comments", commentsSchema);
export default Comments;
