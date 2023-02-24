import type { NextApiRequest, NextApiResponse } from "next";
import { acceptFriendRequest, ResponseData } from "../../controllers/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    await acceptFriendRequest(req, res);
  }
}
