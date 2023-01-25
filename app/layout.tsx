import Footer from "../components/footer";
import Header from "../components/header";
import UserApp from "../context/userApp";
import styles from "./layout.module.css";
import { cookies } from "next/headers";
import User from "../models/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import Connect from "../utils/mongoDBMongooseConnection";

type User = {
  _id: string;
  username: string;
  email: string;
  backgroundPicture: string;
  picture: string;
  viewsName: string;
  friends: Array<string>;
};

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
    const user: User | null = await User.findOne({ username }).lean();
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
          <div className={styles.container}>
            <Header />
            <main className={styles.main}>{children}</main>
            <Footer />
          </div>
        </UserApp>
        <script
          src="https://upload-widget.cloudinary.com/global/all.js"
          type="text/javascript"
        ></script>
      </body>
    </html>
  );
}
