import React, { useState, useContext, useTransition } from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { UserData } from "../../app/views/[id]/profileChecker";
import UserContext from "../../context/context";
import { calculateDateOrTime } from "../../utils/calculateDateOrTime";
type Fields = {
  comments:
    | { user: UserData; content: string; createdAt: Date; comments?: [] }[]
    | [];
  onClick: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
};
const ModalOpenComments = ({
  comments,
  onClick,
  value,
  onChange,
  handleSubmit,
}: Fields) => {
  const context = useContext(UserContext);
  const { user } = context;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.comments}>
          {comments.map((el, index) => {
            console.log(el);
            const postTime = calculateDateOrTime(el.createdAt);
            return (
              <div className={styles.comment} key={index}>
                <div className={styles.content}>
                  <img src={el.user.picture} className={styles.picture} />
                  <div className={styles.nameContent}>
                    <b>{el.user.viewsName}</b>
                    <div>{el.content}</div>
                  </div>
                </div>
                <div className={styles.likeAndComment}>
                  <div className={styles.likeComment}>Like</div>
                  <div className={styles.likeComment}>Aswer</div>
                  <div className={styles.time}>{postTime}</div>
                </div>
                
              </div>
            );
          })}
        </div>
        <div className={styles.postComment}>
          <img src={user?.picture} className={styles.postPicture} />
          <input
            className={styles.addComment}
            onChange={onChange}
            value={value}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className={styles.overlay} onClick={onClick}></div>
      <div className={styles.modalOverlayButton} onClick={onClick}>
        <FontAwesomeIcon className={styles.markButton} icon={faXmark} />
      </div>
    </div>
  );
};
export default ModalOpenComments;
