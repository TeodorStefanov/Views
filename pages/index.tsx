import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import styles from "./index.module.css";
import Login from "../components/other components/login";
import Registration from "../components/other components/register";
import Connect from "../utils/mongoDBMongooseConnection";
import Test from "../models/user";
import { userProps } from "../types/props";
export default function Home({ user }: { user: userProps }) {
  const [loginPress, setLoginPress] = useState<boolean>(false);
  const router = useRouter();
  const message = router.query;
  const getQueryMessage = (): void => {
    if (message.login) {
      setLoginPress(true);
    } else if (message.registration) {
      setLoginPress(true);
    } else {
      setLoginPress(false);
    }
  };
  useEffect(() => {
    getQueryMessage();
  }, [message]);
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.information}>
          <span>Total users: 1000</span>
          <p>Total Views: 100</p>
        </div>
      </div>
      {loginPress ? (
        <div className={styles.modal}>
          {message.login ? <Login /> : <Registration />}
          <div className={styles.overlay}></div>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
}
export const getServerSideProps = async () => {
  await Connect();
  const user: userProps[] = await Test.find();
  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
};
