import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Layout from "../components/layout/Layout";
import InputFiled from "../components/other components/inputFields";
import styles from "./index.module.css";
import Login from "../components/other components/login";
export default function Home() {
  const [loginPress, setLoginPress] = useState<boolean>(false);
  const router = useRouter();
  const message = router.query;
  const getQueryMessage = (): void => {
    console.log(message.login);
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
          <Login />
          <div className={styles.overlay}></div>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
}
