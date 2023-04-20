import type { NextApiRequest, NextApiResponse } from "next";
import Connect from "../utils/mongoDBMongooseConnection";
import User from "../models/user";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serialize } from "cookie";
import { PostsType, UserData } from "../utils/types";
import Posts from "../models/posts";
import Comments from "../models/comments";
import Notification from "../models/notifications";
type loginData = {
  userId: string;
  username: string;
};
const generateToken = (data: loginData) => {
  const token = jwt.sign(data, process.env.PRIVATE_KEY as string, {
    expiresIn: "1h",
  });
  return token;
};
const cookieOptions = {
  expires: new Date(Date.now() + 3600000),
  path: "/",
  httpOnly: true,
};
type Data = {
  username: string;
  password: string;
  email: string;
  picture: string;
  backgroundPicture: string;
  viewsName: string;
  friends: Array<string>;
  posts: PostsType | [];
  notifications: [];
};
type NotificationType = {
  sentBy: string;
  sentTo: string;
  content: string;
  checked: boolean;
  pressed: boolean;
  createdAt: Date;
};
export type ResponseData = {
  message?: string;
  error?: string;
  user?: UserData;
};

export const saveUser = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const { username, password, rePassword, email, viewsName } = req.body;

    if (
      username &&
      password &&
      rePassword &&
      email &&
      viewsName &&
      password.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      ) &&
      password === rePassword
    ) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const data: Data = {
        username,
        password: hashedPassword,
        email,
        picture:
          "https://res.cloudinary.com/daqcaszkf/image/upload/v1673947682/blank-profile-picture-973460__340_v3thun.webp",
        backgroundPicture:
          "https://res.cloudinary.com/daqcaszkf/image/upload/v1674032617/1584x396-pale-aqua-solid-color-background_skjmq8.jpg",
        viewsName,
        friends: [],
        posts: [],
        notifications: [],
      };
      await Connect();
      await User.create<Data>(data);
      res.status(200).send({ message: "Successfully" });
      return;
    } else {
      res.status(400).send({ error: "There is an error" });
      return;
    }
  } catch (err: any) {
    if (err.code === 11000 && err.keyValue.email) {
      res.status(409).send({ error: "Email already exists." });
      return;
    }
    if (err.code === 11000 && err.keyValue.username) {
      res.status(409).send({ error: "Username already exists." });
      return;
    }
    res.status(400).send({ error: "There is an error" });
    return;
  }
};
export const loginUser = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const { username, password } = req.body;
    await Connect();
    const user = await User.findOne({ username })
      .select("+password")
      .select("+username")
      .populate([
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
        { path: "friends", model: User },
      ]);
    if (!user) {
      res.status(401).send({ message: "Wrong username or password" });
      return;
    }
    const status = await bcrypt.compare(password, user.password);
    if (!status) {
      res.status(401).send({ message: "Wrong username or password" });
      return;
    }
    const token = generateToken({
      userId: user._id,
      username: user.username,
    });
    res.setHeader("Set-Cookie", serialize("token", token, cookieOptions));
    res.status(200).send(user);
    return;
  } catch (err) {
    res.status(400).send({ error: "There is an error" });
    return;
  }
};
export const deleteToken = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    res.setHeader(
      "Set-Cookie",
      "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );
    res.status(200).send({ message: "Successfully" });
  } catch (err) {
    res.status(400).send({ error: "There is an error!" });
  }
};
export const acceptFriendRequest = async (
  userId: string,
  friendId: string,
  notificationId: string
) => {
  try {
    await Connect();
    const data: NotificationType = {
      sentBy: userId,
      sentTo: friendId,
      content: "Friend request accepted",
      checked: false,
      pressed: false,
      createdAt: new Date(),
    };
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $addToSet: { friends: friendId },
        $pull: { notifications: notificationId },
      },
      { new: true }
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
      { path: "friends", model: User },
    ]);

    const notification = await Notification.create<Data>(data);
    await Notification.deleteOne({ _id: notificationId });
    const friendUser = await User.findOneAndUpdate(
      { _id: friendId },
      {
        $addToSet: { friends: userId },
        $push: { notifications: notification },
        $pull: { friendRequests: userId },
      },
      { new: true }
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
      { path: "friends", model: User },
    ]);
    return { user, friendUser };
  } catch (err) {
    console.log(err);
  }
};
export const removeFriendRequest = async (
  userId: string,
  friendId: string,
  notificationId: string
) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { notifications: notificationId },
      },
      { new: true }
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
      { path: "friends", model: User },
    ]);
    await Notification.deleteOne({ _id: notificationId });
    const friendUser = await User.findOneAndUpdate(
      { _id: friendId },
      { $pull: { friendRequests: userId } },
      { new: true }
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
      { path: "friends", model: User },
    ]);
    return { user, friendUser };
  } catch (err) {
    console.log(err);
  }
};
export const userChangeBackgroundPicture = async (
  userId: string,
  picture: string
) => {
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { backgroundPicture: picture },
    { new: true }
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
    { path: "friends", model: User },
  ]);
  return user
};
