import React, { useContext, useState } from "react";
import { UserData } from "../../app/views/[id]/profileChecker";
import UserContext from "../../context/context";
import styles from "./index.module.css";
type Fields = {
  el: { user: UserData; content: string; createdAt: Date; comments?: [] };
  answer: boolean;
  postTime: string;
};
const CommentFields = ({ el, answer, postTime }: Fields) => {
  const context = useContext(UserContext);
  const { user } = context;
  const [answerPressed, setAnswerPressed] = useState<boolean>(false);
  return (
    <div>
      <div className={styles.content}>
        <img src={el.user.picture} className={styles.picture} />
        <div className={styles.nameContent}>
          <b>{el.user.viewsName}</b>
          <div>{el.content}</div>
        </div>
      </div>
      <div className={styles.likeAndComment}>
        <div className={styles.likeComment}>Like</div>
        {answer ? (
          <div
            className={styles.likeComment}
            onClick={() => setAnswerPressed(true)}
          >
            Answer
          </div>
        ) : (
          ""
        )}
        <div className={styles.time}>{postTime}</div>
      </div>
      {answerPressed ? (
        <div className={styles.postComment}>
          <img src={user?.picture} className={styles.postPicture} />
          <input className={styles.addComment} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default CommentFields;
