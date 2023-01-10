import type { NextApiRequest, NextApiResponse } from "next";
import Connect from "../../../utils/mongoDBMongooseConnection";
import User from "../../../models/user";
type Data = {
  name: string;
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username, password, repassword, email } = req.body;
  await Connect();
  const user = await User.create<Data>(req.body);
  res.json(user);
}
