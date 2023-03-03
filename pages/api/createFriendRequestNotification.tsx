import type { NextApiRequest, NextApiResponse } from "next";
import { createFriendRequestNotification } from "../../controllers/notifications";
import { ResponseData } from "../../controllers/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    
  }
}
