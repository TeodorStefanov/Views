import React from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
interface Fields {
  picture: string;
  onClick: () => void;
}
const ModalProfilePicture = ({ picture, onClick }: Fields) => {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalMain}>
        <Image src={picture} className={styles.modalPicture} alt="pic" />
      </div>
      <div className={styles.overlay}></div>
      <div className={styles.modalOverlayButton} onClick={onClick}>
        <FontAwesomeIcon className={styles.markButton} icon={faXmark} />
      </div>
    </div>
  );
};
export default ModalProfilePicture;
