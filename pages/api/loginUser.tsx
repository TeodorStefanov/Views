import type { NextApiRequest, NextApiResponse } from "next";
import { loginUser } from "../../controllers/user";
type responseData = {
  message?: string;
  error?: string;
  "set-cookie"?: string[];
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseData>
) {
  if (req.method === "POST") {
    await loginUser(req, res);
  }
}
