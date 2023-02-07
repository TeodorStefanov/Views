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
    require: true,
  },
  likes: [
    {
      type: "ObjectId",
      ref: "User",
    },
  ],
  comments: [
    {
      userId: String,
      content: String,
    },
  ],
});
const Posts = models.Posts || model("Posts", postSchema);
export default Posts;
