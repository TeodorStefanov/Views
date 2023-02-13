import type { NextApiRequest, NextApiResponse } from "next";
import { addLikeToPost } from "../../controllers/posts";
import { ResponseData } from "../../controllers/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "PUT") {
    await addLikeToPost(req, res);
  }
}
