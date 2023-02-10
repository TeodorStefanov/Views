import type { NextApiRequest, NextApiResponse } from "next";
import { createCommentUpdatePost } from "../../controllers/comments";

type responseData = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await createCommentUpdatePost(req, res);
  }
}
