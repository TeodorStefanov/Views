import InputFiled from "../inputFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState } from "react";
const Registration = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
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

      <h1 className={styles.name}>Register Views</h1>

      <InputFiled
        name="Username"
        label="Username"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setUsername(e.target.value)
        }
        type="text"
        placeHolder="Enter your Username"
      />
      <InputFiled
        name="Password"
        label="Password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setPassword(e.target.value)
        }
        type="password"
        placeHolder="Enter your Password"
      />
      <InputFiled
        name="RePassword"
        label="RePassword"
        value={rePassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setRePassword(e.target.value)
        }
        type="password"
        placeHolder="Confirm your Password"
      />
      <InputFiled
        name="Email"
        label="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setEmail(e.target.value)
        }
        type="email"
        placeHolder="Enter your email"
      />
      <button type="submit" className={styles.submitButton}>
        Proceed
      </button>
      <div>
        <p className={styles.registerAccount}>You already have an account?</p>
        <Link href="/?login=true" className={styles.registerAccountButton}>
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default Registration;
