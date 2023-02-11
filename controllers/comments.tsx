import type { NextApiRequest, NextApiResponse } from "next";
import Comments from "../models/comments";
import Posts from "../models/posts";
import User from "../models/user";
import Connect from "../utils/mongoDBMongooseConnection";

type responseData = {
  message?: string;
  error?: string;
};
type Data = {
  id: string;
  content: string;
  date: Date;
};
export const createCommentUpdatePost = async (
  req: NextApiRequest,
  res: NextApiResponse<responseData>
) => {
  try {
    const { userId, id, content } = req.body;
    const createdAt = new Date();
    await Connect();
    const comment = await Comments.create<Data>({
      user: userId,
      content,
      createdAt,
    });
    const post = await Posts.findOneAndUpdate(
      { _id: id },
      { $push: { comments: comment._id } },
      {
        new: true,
      }
    );
    res.status(200).send({ message: "Successfully" });
  } catch (err) {
    console.log(err);
  }
};
