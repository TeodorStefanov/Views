import type { NextApiRequest, NextApiResponse } from "next";
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
export const newCart = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const { userId, content, imageUrl, videoUrl } = req.body;
    const createdAt = new Date();
    const data = {
      content,
      imageUrl,
      videoUrl,
      createdAt,
    };

    await Connect();
    const postCart = await Posts.create<Data>(data);
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { posts: postCart._id } },
      {
        new: true,
      }
    ).populate("posts");
    res.status(200).send({ message: "Successfully" });
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
    const user = await Posts.findOneAndUpdate(
      { _id: postId },
      { $push: { likes: userId } },
      { new: true }
    );
    res.status(200).send({ message: "Successfully" });
  } catch (err) {
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
    const user = await Posts.findOneAndUpdate(
      { _id: postId },
      { $pull: { likes: userId } },
      { new: true }
    );
    res.status(200).send({ message: "Successfully" });
  } catch (err) {
    res.status(400).send({ error: "There is an error!" });
  }
};
