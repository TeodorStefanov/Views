import React from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
interface fields {
  picture: string;
  onClick: () => void;
}
const ModalProfilePicture = ({ picture, onClick }: fields) => {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalMain}>
        <img src={picture} className={styles.modalPicture} />
      </div>
      <div className={styles.overlay}></div>
      <div className={styles.modalOverlayButton} onClick={onClick}>
        <FontAwesomeIcon className={styles.markButton} icon={faXmark} />
      </div>
    </div>
  );
};
export default ModalProfilePicture;
