import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import InputFiled from "../../components/other components/inputFields";
import styles from "./index.module.css";
const LoginPage = () => {
  const [loginPress, setLoginPress] = useState<boolean>(false);
  return (
    <Layout>
      <div className={styles.container}>
        <div>
          <p>Total users: 1000</p>
          <p>Total Views: 100</p>
          <p></p>
        </div>
      </div>
      {loginPress ? (
        <div className={styles.modal}>
          <form className={styles.fields}>
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
};
export default LoginPage;
