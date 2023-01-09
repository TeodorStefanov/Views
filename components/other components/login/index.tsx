import InputFiled from "../inputFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./index.module.css";
import { useRouter } from "next/router";
const Login = () => {
  const router = useRouter();
  const handleCloseButton = (): void => {
    router.push({ pathname: "/", query: '' });
  };
  return (
    <form className={styles.fields}>
      <FontAwesomeIcon
        className={styles.markButton}
        icon={faXmark}
        onClick={handleCloseButton}
      />

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
        <p className={styles.registerAccount}>You dont have an account?</p>
        <a href="/about" className={styles.registerAccountButton}>
          Registration
        </a>
      </div>
    </form>
  );
};

export default Login;
