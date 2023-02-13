import type { NextApiRequest, NextApiResponse } from "next";
import { deleteToken, ResponseData } from "../../controllers/user";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    deleteToken(req, res);
  }
}
