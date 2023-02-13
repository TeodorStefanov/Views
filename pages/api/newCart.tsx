import type { NextApiRequest, NextApiResponse } from "next";
import { newCart } from "../../controllers/posts";
import { ResponseData } from "../../controllers/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "PUT") {
    await newCart(req, res);
  }
}
