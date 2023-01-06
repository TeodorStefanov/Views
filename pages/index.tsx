import Link from "next/link";
import InputFiled from "../components/other components/inputFields";
import styles from "./index.module.css";
export default function Home() {
  return (
    <div className={styles.container}>
      <header>
        <div>
          Views
        </div>
      </header>
      <div>
        <p>Total users: 1000</p>
        <p>Total Views: 100</p>
        <p></p>
      </div>
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
          <p className={styles.registerAccount}>You dont have an account?</p>
          <a href="/about" className={styles.registerAccountButton}>Click here</a>
        </div>
      </form>
    </div>
  );
}
