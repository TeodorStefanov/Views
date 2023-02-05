import type { NextApiRequest, NextApiResponse } from "next";
import { newCart } from "../../controllers/posts";

type responseData = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseData>
) {
  if (req.method === "PUT") {
    
    await newCart(req, res);
  }
}
