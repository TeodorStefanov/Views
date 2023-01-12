import type { NextApiRequest, NextApiResponse } from "next";
import Connect from "../utils/mongoDBMongooseConnection";
import User from "../models/user";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getCookie, setCookie } from "cookies-next";
import { serialize } from "cookie";
type loginData = {
  userId: string;
  username: string;
};
const generateToken = (data: loginData) => {
  const token = jwt.sign(data, process.env.PRIVATE_KEY as string, {
    expiresIn: "1h",
  });
  return token;
};
const cookieOptions = {
 
  path: "/localhost:4000",
};
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
      password.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      ) &&
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
      return;
    } else {
      res.status(400).send({ error: "There is an error" });
      return;
    }
  } catch (err: any) {
    if (err.code === 11000 && err.keyValue.email) {
      res.status(409).send({ error: "Email already exists." });
      return;
    }
    if (err.code === 11000 && err.keyValue.username) {
      res.status(409).send({ error: "Username already exists." });
      return;
    }
    res.status(400).send({ error: "There is an error" });
    return;
  }
};
export const loginUser = async (
  req: NextApiRequest,
  res: NextApiResponse<responseData>
) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).send({ message: "Wrong username or password" });
      return;
    }
    const status = await bcrypt.compare(password, user.password);
    if (!status) {
      res.status(401).send({ message: "Wrong username or password" });
      return;
    }
    const token = generateToken({
      userId: user._id,
      username: user.username,
    });

    res.setHeader('Set-Cookie', serialize('token', token, { path: '/' }))
    res.status(200).send(user);
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: "There is an error" });
    return;
  }
};
