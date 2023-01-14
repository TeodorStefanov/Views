import type { NextApiRequest, NextApiResponse } from "next";
import { deleteToken } from "../../controllers/user";
type responseData = {
  message?: string;
  error?: string;
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseData>
) {
  if (req.method === "GET") {
    deleteToken(req, res);
  }
}
