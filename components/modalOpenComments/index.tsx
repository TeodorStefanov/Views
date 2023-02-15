import React, { useState, useContext, useTransition } from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { UserData } from "../../app/views/[id]/profileChecker";
import UserContext from "../../context/context";
import { calculateDateOrTime } from "../../utils/calculateDateOrTime";
import CommentFields from "../commentFields";
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
            const postTime = calculateDateOrTime(el.createdAt);
            return (
              <div className={styles.comment} key={index}>
                <CommentFields el={el} answer={true} postTime={postTime} />
                {el.comments && el.comments.length === 0 ? (
                  <div className={styles.commentOfComment} key={index}>
                    <CommentFields el={el} answer={false} postTime={postTime} />
                  </div>
                ) : (
                  ""
                )}
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
