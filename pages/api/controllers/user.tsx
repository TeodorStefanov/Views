import type { NextApiRequest, NextApiResponse } from "next";
import Connect from "../../../utils/mongoDBMongooseConnection";
import User from "../../../models/user";
import * as bcrypt from "bcrypt";
type Data = {
  username: string;
  password: string;
  rePassword?: string;
  email: string;
};
type responseData = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseData>
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
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const data = {
          username,
          password: hashedPassword,
          email,
        };
        await Connect();
        await User.create<Data>(data);
        res.status(200).send({ message: "Successfully" });
      } catch (err: any) {
        if (err.code === 11000 && err.keyValue.email) {
          return res.status(409).send({ error: "Email already exists" });
        }
        if (err.code === 11000 && err.keyValue.username) {
          return res.status(409).send({ error: "Username already exists" });
        }
        res.status(400).send({ error: "There is an error" });
      }
    }
  }
}
