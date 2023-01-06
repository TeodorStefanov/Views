import Link from "next/link";
import InputFiled from "../components/other components/inputFields";
import styles from "./index.module.css";
export default function Home() {
  return (
    <div className={styles.container}>
      <InputFiled
        name="Username"
        label="Username"
        value="Username"
        type="text"
      />
      <InputFiled
        name="Password"
        label="Password"
        value="Password"
        type="Password"
      />
    </div>
  );
}
