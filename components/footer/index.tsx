"use client";
import React, { useContext } from "react";
import UserContext from "../../context/context";
import styles from "./index.module.css";
const Footer = () => {
  const context = useContext(UserContext);
  const { loggedIn } = context;
  return (
    <div className={styles.container}>
      <span className={styles.information}>
        {!loggedIn ? "Be part of this !" : "Thank you for being part of this!"}
      </span>
    </div>
  );
};
export default Footer;
