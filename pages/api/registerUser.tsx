import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData, saveUser } from "../../controllers/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    await saveUser(req, res);
  }
}
