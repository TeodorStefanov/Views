import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import styles from "./index.module.css";
import Login from "../components/other components/login";
import Registration from "../components/other components/register";
export default function Home() {
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
