import type { NextApiRequest, NextApiResponse } from "next";
import { addCommentOfComment } from "../../controllers/comments";
import { ResponseData } from "../../controllers/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    await addCommentOfComment(req, res);
  }
}
