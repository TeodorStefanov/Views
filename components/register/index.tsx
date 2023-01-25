import InputFiled from "../inputFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./index.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FC } from "react";

interface IFormInputs {
  username: string;
  password: string;
  rePassword: string;
  email: string;
  viewsName: string;
}
const Registration: FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInputs>();

  const handleInput: SubmitHandler<IFormInputs> = async (data: IFormInputs) => {
    const { username, password, rePassword, email, viewsName } = data;
    if (
      username &&
      password &&
      rePassword &&
      email &&
      viewsName &&
      password === rePassword
    ) {
      const promise = await fetch("/api/registerUpdateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (promise.status === 200) {
        router.push("/?login=true");
      } else if (promise.status === 409) {
        const result = await promise.json();
        setError(result.error);
      } else {
        setError("An error has occurred. Please try again.");
      }
    }
  };
  return (
    <form className={styles.fields} onSubmit={handleSubmit(handleInput)}>
      <FontAwesomeIcon
        className={styles.markButton}
        icon={faXmark}
        onClick={() => router.push("/")}
      />
      <h1 className={styles.name}>Register Views</h1>
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
      <InputFiled
        formHook={register("rePassword", {
          required: "This field is required",
          validate: (val: string) => {
            if (watch("password") != val) {
              return "Both passwords must match!";
            }
          },
        })}
        name="RePassword"
        label="RePassword"
        type="password"
        placeHolder="Confirm your Password"
        errorMessage={errors.rePassword ? errors.rePassword.message : ""}
      />
      <InputFiled
        formHook={register("email", {
          required: "This field is required",
          validate: (val: string) => {
            const regEx =
              /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            if (!val.match(regEx)) {
              return '"Please enter correct email address"';
            }
          },
        })}
        name="Email"
        label="Email"
        type="email"
        placeHolder="Enter your email"
        errorMessage={errors.email ? errors.email.message : ""}
      />
      <InputFiled
        formHook={register("viewsName", {
          required: "This field is required",
          minLength: 3,
        })}
        name="ViewsName"
        label="ViewsName"
        type="text"
        placeHolder="Enter your Views Name"
        errorMessage={errors.viewsName ? errors.viewsName.message : ""}
      />
      <button type="submit" className={styles.submitButton}>
        Proceed
      </button>
      {error ? <div className={styles.errorMessage}>{error}</div> : ""}
      <div>
        <p className={styles.registerAccount}>You already have an account?</p>
        <Link
          href={{ pathname: "/", query: { message: "login" } }}
          className={styles.registerAccountButton}
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default Registration;
