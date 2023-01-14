import type { NextApiRequest, NextApiResponse } from "next";
import { checkAuthentication } from "../../controllers/user";
type responseData = {
  message?: string;
  error?: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseData>
) {
  if (req.method === "GET") {
    await checkAuthentication(req, res);
  }
}
