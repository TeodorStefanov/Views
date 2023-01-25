import type { NextApiRequest, NextApiResponse } from "next";
import { saveUser, updateUser } from "../../controllers/user";

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
  } else if (req.method === "PUT") {
    await updateUser(req, res);
  }
}
