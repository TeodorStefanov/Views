import React, { useContext } from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { user2 } from "../../app/views/[id]/profileChecker";
import UserContext from "../../context/context";
type fields = {
  users: user2[] | [];
  onClick: () => void;
};
const ModalLikedUsers = ({ users, onClick }: fields) => {
  const context = useContext(UserContext);
  const { user } = context;
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {users.map((el: any, index: number) => {
          return (
            <div className={styles.user} key={index}>
              <div className={styles.userNameAndPicture}>
                <img src={el.picture} className={styles.picture}/>
                <div className={styles.viewsName}>{el.viewsName}</div>
              </div>
              {el._id !== user?._id ? (
                <button className={styles.follow}>Follow</button>
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.overlay} onClick={onClick}></div>
      <div className={styles.modalOverlayButton} onClick={onClick}>
        <FontAwesomeIcon className={styles.markButton} icon={faXmark} />
      </div>
    </div>
  );
};
export default ModalLikedUsers;
