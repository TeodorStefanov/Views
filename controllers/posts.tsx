import type { NextApiRequest, NextApiResponse } from "next";
import Comments from "../models/comments";
import Notification from "../models/notifications";
import Posts from "../models/posts";
import User from "../models/user";
import Connect from "../utils/mongoDBMongooseConnection";
import { ResponseData } from "./user";

type Data = {
  content: string;
  imageUrl: string;
  videoUrl: string;
  createdAt: Date;
};
type NotificationData = {
  sentBy: string;
  sentTo: string;
  content: string;
  checked: boolean;
  pressed: boolean;
  createdAt: Date;
};
export const newCart = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const { userId, content, imageUrl, videoUrl, createdBy } = req.body;
    const createdAt = new Date();
    const data = {
      content,
      imageUrl,
      videoUrl,
      createdAt,
      createdBy,
    };
    const notificationData: NotificationData = {
      sentBy: createdBy,
      sentTo: userId,
      content: "posted on your wall",
      checked: false,
      pressed: false,
      createdAt,
    };
    await Connect();
    if (userId !== createdBy) {
      const notification = await Notification.create<NotificationData>(
        notificationData
      );
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: { notifications: notification._id },
        },
        {
          new: true,
        }
      );
    }

    const postCart = await Posts.create<Data>(data);
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { posts: postCart._id },
      },
      {
        new: true,
      }
    ).populate({
      path: "posts",
      model: Posts,
      populate: [
        { path: "likes", model: User },
        {
          path: "comments",
          model: Comments,
          populate: [
            { path: "likes", model: User },
            {
              path: "comments",
              model: Comments,
              populate: [
                { path: "likes", model: User },
                { path: "comments", model: Comments },
                { path: "user", model: User },
              ],
            },
            { path: "user", model: User },
          ],
        },
        { path: "createdBy", model: User },
      ],
    });

    res.status(200).send(user.posts.reverse());
  } catch (err) {
    res.status(400).send({ error: "There is an error!" });
  }
};
export const addLikeToPost = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { postId, userId } = req.body;
  try {
    await Connect();
    const post = await Posts.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { likes: userId } },
      { new: true }
    ).populate([
      { path: "likes", model: User },
      {
        path: "comments",
        model: Comments,
        populate: [
          { path: "likes", model: User },
          {
            path: "comments",
            model: Comments,
            populate: [
              { path: "likes", model: User },
              { path: "comments", model: Comments },
              { path: "user", model: User },
            ],
          },
          { path: "user", model: User },
        ],
      },
      { path: "createdBy", model: User },
    ]);

    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: "There is an error!" });
  }
};
export const deleteLikeToPost = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { postId, userId } = req.body;
  try {
    await Connect();
    const post = await Posts.findOneAndUpdate(
      { _id: postId },
      { $pull: { likes: userId } },
      { new: true }
    ).populate([
      { path: "likes", model: User },
      {
        path: "comments",
        model: Comments,
        populate: [
          { path: "likes", model: User },
          {
            path: "comments",
            model: Comments,
            populate: [
              { path: "likes", model: User },
              { path: "comments", model: Comments },
              { path: "user", model: User },
            ],
          },
          { path: "user", model: User },
        ],
      },
      { path: "createdBy", model: User },
    ]);
    res.status(200).send(post);
  } catch (err) {
    res.status(400).send({ error: "There is an error!" });
  }
};
