import type { NextApiRequest, NextApiResponse } from "next";
import Comments from "../models/comments";
import Posts from "../models/posts";
import Connect from "../utils/mongoDBMongooseConnection";
import { ResponseData } from "./user";

type Data = {
  id: string;
  content: string;
  date: Date;
};
export const createCommentUpdatePost = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const { userId, id, contentComment } = req.body;
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
    );
    res.status(200).send({ message: "Successfully" });
  } catch (err) {
    res.status(400).send({ error: "There is an error!" });
  }
};
