import React from "react";
import { Comment } from "../../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";
import styles from "./index.module.css";
import Image from "next/image";
type Fields = {
  el: Comment;
  answer: boolean;
  postTime: string;
  onClick?: () => void;
  onClickLike: (e: React.MouseEvent) => void;
  onClickDeleteLike: (e: React.MouseEvent) => void;
  liked: boolean;
  openLikeModal: (like: Comment) => void;
};
const CommentFields = ({
  el,
  answer,
  postTime,
  onClick,
  onClickLike,
  onClickDeleteLike,
  liked,
  openLikeModal,
}: Fields) => {
  
  return (
    <div>
      <div className={styles.content}>
        <Image src={el.user.picture} className={styles.picture} alt='pic'/>
        <div className={styles.nameContent}>
          <b>{el.user.viewsName}</b>
          <div className={styles.contentContent}>{el.content}</div>
          {el.likes.length > 0 ? (
            <div
              className={styles.commentLikes}
              onClick={(e) => openLikeModal(el)}
            >
              <FontAwesomeIcon className={styles.likeMark} icon={faThumbsUp} />
              {el.likes.length > 1 ? (
                <span className={styles.numberOfLikes}>{el.likes.length}</span>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
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
