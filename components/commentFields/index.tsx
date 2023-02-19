import React from "react";
import { Comment } from "../../app/views/[id]/profileChecker";

import styles from "./index.module.css";
type Fields = {
  el: Comment;
  answer: boolean;
  postTime: string;
  onClick?: () => void;
  onClickLike: (e: React.MouseEvent) => void;
  onClickDeleteLike: (e: React.MouseEvent) => void;
  liked: boolean;
};
const CommentFields = ({
  el,
  answer,
  postTime,
  onClick,
  onClickLike,
  onClickDeleteLike,
  liked,
}: Fields) => {
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
        {!liked ? (
          <div className={styles.likeComment} onClick={onClickLike}>
            Like
          </div>
        ) : (
          <div className={styles.liked} onClick={onClickDeleteLike}>
            Like
          </div>
        )}
        {answer ? (
          <div className={styles.likeComment} onClick={onClick}>
            Answer
          </div>
        ) : (
          ""
        )}
        <div className={styles.time}>{postTime}</div>
      </div>
    </div>
  );
};
export default CommentFields;
