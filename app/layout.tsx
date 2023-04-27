import Footer from "../components/footer";
import Header from "../components/header";
import UserApp from "../context/userApp";
import styles from "./layout.module.css";
import { cookies } from "next/headers";
import User from "../models/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import Connect from "../utils/mongoDBMongooseConnection";
import Posts from "../models/posts";
import Notification from "../models/notifications";
import { UserData } from "../utils/types";
import SocketApp from "../context/socketApp";

export const revalidate = 0;
async function getToken() {
  try {
    const nextCokies = cookies();
    const token = nextCokies.get("token");
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token.value,
      process.env.PRIVATE_KEY as string
    ) as JwtPayload;
    if (!decoded) {
      return null;
    }
    const { username } = decoded;
    await Connect();
    const user: UserData | null = await User.findOne({ username })
      .populate([
        { path: "posts", model: Posts },
        {
          path: "notifications",
          model: Notification,
          populate: { path: "sentBy", model: User },
        },
        { path: "friendRequests", model: User },
        { path: "friends", model: User },
      ])
      .lean();
    return JSON.parse(JSON.stringify(user));
  } catch (err) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  return (
    <html>
      <head />
      <body className={styles.body}>
        <UserApp token={token}>
          <SocketApp>
            <div className={styles.container}>
              <Header />
              <main className={styles.main}>{children}</main>
              <Footer />
            </div>
          </SocketApp>
        </UserApp>
        <script
          src="https://upload-widget.cloudinary.com/global/all.js"
          type="text/javascript"
        ></script>
      </body>
    </html>
  );
}
