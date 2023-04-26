import React, { useContext } from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { UserData } from "../../utils/types";
import UserContext from "../../context/context";
import { useRouter } from "next/navigation";
import Image from "next/image";
type Fields = {
  users: UserData[] | [];
  onClick: () => void;
  id: string;
};
const ModalOpenLikes = ({ users, onClick, id }: Fields) => {
  const router = useRouter();
  const context = useContext(UserContext);
  const { user } = context;
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {users.map((el: UserData, index: number) => {
          return (
            <div className={styles.user} key={index}>
              <div className={styles.userNameAndPicture}>
                <Image
                  src={el.picture}
                  className={styles.picture}
                  width={200}
                  height={200}
                  onClick={() => {
                    if (el._id === id) {
                      onClick();
                    }
                    router.push(`/views/${el._id}`);
                  }}
                  alt="pic"
                />
                <div
                  className={styles.viewsName}
                  onClick={() => {
                    if (el._id === id) {
                      onClick();
                    }
                    router.push(`/views/${el._id}`);
                  }}
                >
                  {el.viewsName}{" "}
                </div>
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
export default ModalOpenLikes;
