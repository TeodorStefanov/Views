import InputFiled from "../inputFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Props } from "../inputFields";
import { FC } from "react";
const Registration: FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const {
    register,

    watch,
    formState: { errors },
  } = useForm();
  const handleCloseButton = (): void => {
    router.replace({ pathname: "/", query: "" });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      username &&
      password &&
      rePassword &&
      email &&
      password === rePassword
    ) {
      const promise = await fetch("/api/controllers/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, rePassword, email }),
      });
      if (promise.status === 200) {
        router.push("/?login=true");
      } else if (promise.status === 409) {
        const result = await promise.json();
        setError(result.error);
      }
    }
  };
  return (
    <form className={styles.fields} onSubmit={handleSubmit}>
      <FontAwesomeIcon
        className={styles.markButton}
        icon={faXmark}
        onClick={handleCloseButton}
      />
      <h1 className={styles.name}>Register Views</h1>
      <InputFiled
        formHook={register("Username", { required: true })}
        name="Username"
        label="Username"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          setUsername(e.target.value);
        }}
        type="text"
        placeHolder="Enter your Username"
      />
      {errors.Username && <span>This field is required</span>}
      <InputFiled
        formHook={register("Password", { required: true })}
        name="Password"
        label="Password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          setPassword(e.target.value);
        }}
        type="password"
        placeHolder="Enter your Password"
      />
      {errors.Password && <span>This field is required</span>}
      <InputFiled
        formHook={register("rePassword", { required: true })}
        name="RePassword"
        label="RePassword"
        value={rePassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          setRePassword(e.target.value);
        }}
        type="password"
        placeHolder="Confirm your Password"
      />
      {errors.rePassword && <span>This field is required</span>}
      <InputFiled
        formHook={register("Email", { required: true })}
        name="Email"
        label="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          setEmail(e.target.value);
        }}
        type="email"
        placeHolder="Enter your email"
      />
      {errors.Email && <span>This field is required</span>}
      <button type="submit" className={styles.submitButton}>
        Proceed
      </button>
      {error ? <div className={styles.errorMessage}>{error}</div> : ""}
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
