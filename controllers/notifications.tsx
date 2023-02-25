import { create } from "domain";
import type { NextApiRequest, NextApiResponse } from "next";
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
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { userId, friendId } = req.body;
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
    );
    await User.findOneAndUpdate(
      { _id: friendId },
      { $addToSet: { notifications: notification } },
      {
        new: true,
      }
    );
    res.status(200).send(user);
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
