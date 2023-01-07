import Link from "next/link";
import React from "react";
import styles from "./index.module.css";
const Header = () => {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>Views</Link>
      
      <div className={styles.windows}>
        <Link href="/login" className={styles.windowLogin}>
          Log In
        </Link>
        <Link href="/registration" className={styles.windowRegister}>
          Registration
        </Link>
      </div>
    </div>
  );
};
export default Header;
