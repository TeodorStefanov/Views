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

export const saveUser = async (
  req: NextApiRequest,
  res: NextApiResponse<responseData>
) => {
  try {
    const { username, password, rePassword, email } = req.body;
    if (
      username &&
      password &&
      rePassword &&
      email &&
      password === rePassword
    ) {
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
      return
    } else {
      res.status(400).send({ error: "There is an error" });
      return
    }
  } catch (err: any) {
    if (err.code === 11000 && err.keyValue.email) {
      res.status(409).send({ error: "Email already exists." });
      return
    }
    if (err.code === 11000 && err.keyValue.username) {
      res.status(409).send({ error: "Username already exists." });
      return
    }
    res.status(400).send({ error: "There is an error" });
    return
  }
};
