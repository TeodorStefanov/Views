import mongoose, { Schema, model, models } from "mongoose";
const postSchema = new Schema({
  content: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  createdBy: {
    type: "ObjectId",
    ref: "User",
  },
  createdTo: {
    type: "ObjectId",
    ref: "User",
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
const Posts = models.Posts || model("Posts", postSchema);
export default Posts;
