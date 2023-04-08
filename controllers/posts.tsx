import Comments from "../models/comments";
import Notification from "../models/notifications";
import Posts from "../models/posts";
import User from "../models/user";
import Connect from "../utils/mongoDBMongooseConnection";

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
  userId: string,
  content: string,
  imageUrl: string,
  videoUrl: string,
  createdBy: string
) => {
  try {
    const createdAt = new Date();
    const data = {
      content,
      imageUrl,
      videoUrl,
      createdAt,
      createdBy,
      createdTo: userId,
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
    return user.posts.reverse();
  } catch (err) {
    console.log(err);
  }
};
export const addLikeToPost = async (
  postId: string,
  userId: string,
  roomId: string
) => {
  try {
    await Connect();
    await Posts.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { likes: userId } },
      { new: true }
    );
    const user = await User.findById(roomId).populate({
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
    return user.posts.reverse();
  } catch (err) {
    console.log(err);
  }
};
export const deleteLikeToPost = async (
  postId: string,
  userId: string,
  roomId: string
) => {
  try {
    await Connect();
    await Posts.findOneAndUpdate(
      { _id: postId },
      { $pull: { likes: userId } },
      { new: true }
    );
    const user = await User.findById(roomId).populate({
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
        {
          path: "createdBy",
          model: User,
        },
      ],
    });
    return user.posts.reverse();
  } catch (err) {
    console.log(err);
  }
};
