import type { NextApiRequest, NextApiResponse } from "next";
import Connect from "../../../utils/mongoDBMongooseConnection";
import User from "../../../models/user";
type Data = {
  username: string;
  password: string;
  rePassword?: string;
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { username, password, rePassword, email } = req.body;
    if (
      username &&
      password &&
      rePassword &&
      email &&
      password === rePassword
    ) {
      try {
        const data = {
          username,
          password,
          email,
        };
        await Connect();
        const user = await User.create<Data>(data);
        res.json(user);
      } catch (err) {
        console.log(err);
      }
    }
  }
}
