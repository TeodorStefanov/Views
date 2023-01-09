import type { NextApiRequest, NextApiResponse } from "next";
import Connect from "../../../utils";
import Test from "../../../models/testModels";
type Data = {
  name: string;
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { name, email } = req.body;
  await Connect();
  const test = await Test.create<Data>(req.body);
  console.log("1");
  res.json(test);
}
