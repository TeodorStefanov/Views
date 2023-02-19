import type { NextApiRequest, NextApiResponse } from "next";
import { addLikeToComment } from "../../controllers/comments";
import { ResponseData } from "../../controllers/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "PUT") {
    
    await addLikeToComment(req, res);
  }
}
