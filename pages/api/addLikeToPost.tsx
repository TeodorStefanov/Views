import type { NextApiRequest, NextApiResponse } from "next";
import { addLikeToPost } from "../../controllers/posts";

type responseData = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseData>
) {
  if (req.method === "PUT") {
    await addLikeToPost(req, res);
  }
}