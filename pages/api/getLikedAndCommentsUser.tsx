import type { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../../controllers/user";

type responseData = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await getUser(req, res);
  }
}
