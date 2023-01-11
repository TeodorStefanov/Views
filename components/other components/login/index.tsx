import InputFiled from "../inputFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState } from "react";
const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleCloseButton = (): void => {
    router.push({ pathname: "/", query: "" });
  };
  return (
    <form className={styles.fields}>
      <FontAwesomeIcon
        className={styles.markButton}
        icon={faXmark}
        onClick={handleCloseButton}
      />

      <h1 className={styles.name}>Login Views</h1>

      <InputFiled
        name="Username"
        label="Username"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          setUsername(e.target.value);
        }}
        type="text"
        placeHolder="Enter your Username"
      />
      <InputFiled
        name="Password"
        label="Password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          setPassword(e.target.value);
        }}
        type="password"
        placeHolder="Enter your Password"
      />
      <button type="submit" className={styles.submitButton}>
        Proceed
      </button>
      <div className={styles.forgotYourPassword}>
        <button className={styles.forgotYourPasswordButton}>
          Forgot Your Password?
        </button>
      </div>
      <div>
        <p className={styles.registerAccount}>You dont have an account?</p>
        <Link
          href="/?registration=true"
          className={styles.registerAccountButton}
        >
          Registration
        </Link>
      </div>
    </form>
  );
};

export default Login;
