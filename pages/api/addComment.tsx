import type { NextApiRequest, NextApiResponse } from "next";
import { addComment } from "../../controllers/posts";

type responseData = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseData>
) {
  if (req.method === "PUT") {
    console.log(1)
    await addComment(req, res);
  }
}
