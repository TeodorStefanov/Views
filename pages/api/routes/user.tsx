import type { NextApiRequest, NextApiResponse } from "next";
import { saveUser } from "../controllers/user";

type responseData = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseData>
) {
  if (req.method === "POST") {
    await saveUser(req, res);
  }
}
