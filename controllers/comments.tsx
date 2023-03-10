import type { NextApiRequest, NextApiResponse } from "next";
import Comments from "../models/comments";
import Posts from "../models/posts";
import User from "../models/user";
import Connect from "../utils/mongoDBMongooseConnection";
import { ResponseData } from "./user";

type Data = {
  id: string;
  content: string;
  createdAt: Date;
};
export const createCommentUpdatePost = async (
  userId: string,
  id: string,
  contentComment: string
) => {
  try {
    const createdAt = new Date();
    await Connect();
    const comment = await Comments.create<Data>({
      user: userId,
      content: contentComment,
      createdAt,
    });
    const post = await Posts.findOneAndUpdate(
      { _id: id },
      { $push: { comments: comment._id } },
      {
        new: true,
      }
    ).populate([
      {
        path: "comments",
        model: Comments,
        populate: [
          { path: "user", model: User },
          {
            path: "comments",
            model: Comments,
            populate: { path: "user", model: User },
          },
          { path: "likes", model: User },
        ],
      },
      { path: "likes", model: User },
      { path: "createdBy", model: User },
    ]);

    return post;
  } catch (err) {
    console.log(err);
  }
};
export const addCommentOfComment = async (
  userId: string,
  id: string,
  contentComment: string,
  postId: string
) => {
  try {
    const createdAt = new Date();
    await Connect();
    const comment = await Comments.create<Data>({
      user: userId,
      content: contentComment,
      createdAt,
    });
    await Comments.findOneAndUpdate(
      { _id: id },
      { $push: { comments: comment._id } },
      {
        new: true,
      }
    );
    const post = await Posts.findById(postId).populate([
      {
        path: "comments",
        model: Comments,
        populate: [
          { path: "user", model: User },
          {
            path: "comments",
            model: Comments,
            populate: { path: "user", model: User },
          },
          { path: "likes", model: User },
        ],
      },
      { path: "likes", model: User },
      { path: "createdBy", model: User },
    ])
    return post;
  } catch (err) {
    console.log(err);
  }
};
export const addLikeToComment = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { commentId, userId, postId } = req.body;
  try {
    await Connect();
    await Comments.findOneAndUpdate(
      { _id: commentId },
      { $addToSet: { likes: userId } },
      { new: true }
    );
    const post = await Posts.findById(postId).populate([
      {
        path: "comments",
        model: Comments,
        populate: [
          { path: "user", model: User },
          { path: "likes", model: User },
          {
            path: "comments",
            model: Comments,
            populate: [
              { path: "user", model: User },
              { path: "likes", model: User },
            ],
          },
        ],
      },
      { path: "likes", model: User },
      { path: "createdBy", model: User },
    ]);
    res.status(200).send(post);
  } catch (err) {
    res.status(400).send({ error: "There is an error!" });
  }
};
export const deleteLikeToComment = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { commentId, userId, postId } = req.body;
  try {
    await Connect();
    await Comments.findOneAndUpdate(
      { _id: commentId },
      { $pull: { likes: userId } },
      { new: true }
    );
    const post = await Posts.findById(postId).populate([
      {
        path: "comments",
        model: Comments,
        populate: [
          { path: "user", model: User },
          { path: "likes", model: User },
          {
            path: "comments",
            model: Comments,
            populate: [
              { path: "user", model: User },
              { path: "likes", model: User },
            ],
          },
        ],
      },
      { path: "createdBy", model: User },
    ]);
    res.status(200).send(post);
  } catch (err) {
    res.status(400).send({ error: "There is an error!" });
  }
};
