import React from "react";
import styles from "./index.module.css";

const LoadingLoader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default LoadingLoader;
