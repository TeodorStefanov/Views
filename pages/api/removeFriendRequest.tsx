import type { NextApiRequest, NextApiResponse } from "next";
import { removeFriendRequest, ResponseData } from "../../controllers/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "PUT") {
    await removeFriendRequest(req, res);
  }
}
