import InputFiled from "../inputFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import React from "react";
import { FC } from "react";
interface IFormInputs {
  username: string;
  password: string;
}
const Login: FC = () => {
  const router = useRouter();
  const handleCloseButton = (): void => {
    router.push({ pathname: "/", query: "" });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const handleInput: SubmitHandler<IFormInputs> = async (data: IFormInputs) => {
    const promise = await fetch("/api/loginUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await promise.json()
    console.log(result)
  };
  return (
    <form className={styles.fields} onSubmit={handleSubmit(handleInput)}>
      <FontAwesomeIcon
        className={styles.markButton}
        icon={faXmark}
        onClick={handleCloseButton}
      />

      <h1 className={styles.name}>Login Views</h1>

      <InputFiled
        formHook={register("username", {
          required: "This field is required",
          minLength: {
            value: 8,
            message: "Username must be at least 8 symbols",
          },
        })}
        name="Username"
        label="Username"
        type="text"
        placeHolder="Enter your Username"
        errorMessage={errors.username ? errors.username.message : ""}
      />
      <InputFiled
        formHook={register("password", {
          required: "This field is required",
          minLength: {
            value: 8,
            message:
              "Password must contain minimum eight characters, at least one letter, one number and one special character!",
          },
          validate: (val: string) => {
            const regEx =
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!val.match(regEx)) {
              return "Password must contain minimum eight characters, at least one letter, one number and one special character!";
            }
          },
        })}
        name="Password"
        label="Password"
        type="password"
        placeHolder="Enter your Password"
        errorMessage={errors.password ? errors.password.message : ""}
      />
      <br />
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
