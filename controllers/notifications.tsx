import { create } from "domain";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserData } from "../app/views/[id]/profileChecker";
import Comments from "../models/comments";
import Notification from "../models/notifications";
import Posts from "../models/posts";
import User from "../models/user";
import Connect from "../utils/mongoDBMongooseConnection";
import { ResponseData } from "./user";
type Data = {
  sentBy: string;
  sentTo: string;
  content: string;
  checked: boolean;
  pressed: boolean;
  createdAt: Date;
};
export const createFriendRequestNotification = async (
  userId: string,
  friendId: string
) => {
  try {
    const data: Data = {
      sentBy: userId,
      sentTo: friendId,
      content: "Friend request",
      checked: false,
      pressed: false,
      createdAt: new Date(),
    };
    await Connect();
    const notification = await Notification.create<Data>(data);
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { friendRequests: friendId } },
      {
        new: true,
      }
    ).populate([
      {
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
        ],
      },
      {
        path: "notifications",
        model: Notification,
        populate: [
          { path: "sentBy", model: User },
          { path: "sentTo", model: User },
        ],
      },
      { path: "friendRequests", model: User },
    ]);
    const friendUser = await User.findOneAndUpdate(
      { _id: friendId },
      { $addToSet: { notifications: notification } },
      {
        new: true,
      }
    ).populate([
      {
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
        ],
      },
      {
        path: "notifications",
        model: Notification,
        populate: { path: "sentBy", model: User },
      },
      { path: "friendRequests", model: User },
    ]);
    return { user, friendUser, notificationId: notification._id };
  } catch (err) {
    console.log(err);
  }
};
export const userNotificationsChecked = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { userId } = req.body;
  try {
    await Connect();
    await Notification.updateMany(
      { sentTo: userId },
      { $set: { checked: true } }
    );

    res.status(200).send({ message: "Successfully" });
  } catch (err) {
    console.log(err);
  }
};
export const userNotificationPressed = async (userId: string, id: string) => {
  try {
    await Connect();
    await Notification.findOneAndUpdate(
      { _id: id },
      { pressed: true },
      {
        new: true,
      }
    );
    const user = await User.findOne({ _id: userId }).populate([
      {
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
      },
      {
        path: "notifications",
        model: Notification,
        populate: { path: "sentBy", model: User },
      },
      { path: "friendRequests", model: User },
    ]);
    return user;
  } catch (err) {
    console.log(err);
  }
};
