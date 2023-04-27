"use client";
import { useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import Login from "../components/login";
import Registration from "../components/register";
import UserContext from "../context/context";
import { useSearchParams } from "next/navigation";

export type userProps = {
  username: string;
  password: string;
  email: string;
};
export default function Home() {
  const [loginPress, setLoginPress] = useState<boolean>(false);
  const context = useContext(UserContext);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const getQueryMessage = (): void => {
    if (message === "login") {
      setLoginPress(true);
    } else if (message === "registration") {
      setLoginPress(true);
    } else {
      setLoginPress(false);
    }
  };

  useEffect(() => {
    getQueryMessage();
  }, [message]);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.information}>
          <span>Total users: 1000</span>
          <p>Total Views: 100 </p>
        </div>
      </div>
      {loginPress ? (
        <div className={styles.modal}>
          {message === "login" ? <Login /> : <Registration />}
          <div className={styles.overlay}></div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
