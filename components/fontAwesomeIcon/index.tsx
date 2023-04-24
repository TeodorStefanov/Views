import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./index.module.css";
type Props = {
  icon: any;
  title: string;
};
const FontIcon = ({ icon, title }: Props) => {
  return (
    <div className={styles.leftMenuButton}>
      <FontAwesomeIcon className={styles.leftMenuIcon} icon={icon} />
      <span>{title}</span>
    </div>
  );
};
export default FontIcon;
