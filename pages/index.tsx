import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Layout from "../components/layout/Layout";
import InputFiled from "../components/other components/inputFields";
import styles from "./index.module.css";
export default function Home() {
  const [loginPress, setLoginPress] = useState<boolean>(false);
  const router = useRouter();
  const message = router.query;
  const getQueryMessage = () => {
    console.log(message.login);
    if (message.login) {
      setLoginPress(true);
    } else if (message.registration) {
      setLoginPress(true);
    }
  };
  useEffect(() => {
    getQueryMessage();
  }, [message]);
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.information}>
          <p>Total users: 1000</p>
          <p>Total Views: 100</p>
        </div>
      </div>
      {loginPress ? (
        <div className={styles.modal}>
          <form className={styles.fields}>
            <FontAwesomeIcon className={styles.markButton} icon={faXmark} />

            <h1 className={styles.name}>Login in Views</h1>

            <InputFiled
              name="Username"
              label="Username"
              value="Username"
              type="text"
              placeHolder="Enter your Username"
            />
            <InputFiled
              name="Password"
              label="Password"
              value="Password"
              type="password"
              placeHolder="Enter your Password"
            />
            <button type="submit" className={styles.submitButton}>
              Proceed
            </button>
            <div className={styles.forgetYourPassword}>
              <button className={styles.forgetYourPasswordButton}>
                Forget Your Password?
              </button>
            </div>
            <div>
              <p className={styles.registerAccount}>
                You dont have an account?
              </p>
              <a href="/about" className={styles.registerAccountButton}>
                Click here
              </a>
            </div>
          </form>
          <div className={styles.overlay}></div>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
}
