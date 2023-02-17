import React, { useState, useContext, useTransition } from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Comment, UserData } from "../../app/views/[id]/profileChecker";
import UserContext from "../../context/context";
import { calculateDateOrTime } from "../../utils/calculateDateOrTime";
import CommentFields from "../commentFields";
type Fields = {
  comments: Array<Comment> | [];
  onClick: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  handleSubmitCommentOfComment: (id: string) => void;
  commentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  commentOfCommentContent: string;
};
const ModalOpenComments = ({
  comments,
  onClick,
  value,
  onChange,
  handleSubmit,
  handleSubmitCommentOfComment,
  commentChange,
  commentOfCommentContent,
}: Fields) => {
  const context = useContext(UserContext);
  const { user } = context;
  const [answerPressed, setAnswerPressed] = useState<number>();
  const [content, setContent] = useState<string>("");
  const [id, setId] = useState<string>("");

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    comment: string,
    id?: string
  ): void => {
    if (e.key === "Enter") {
      if (comment === "comment") {
        handleSubmit();
      } else if (comment === "commentOfComment") {
        handleSubmitCommentOfComment(id!);
      }
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
                <CommentFields
                  el={el}
                  answer={true}
                  postTime={postTime}
                  onClick={() => setAnswerPressed(index)}
                />
                {el.comments.map((el, index) => {
                  const postTime = calculateDateOrTime(el.createdAt);
                  return (
                    <div className={styles.commentOfComment} key={index}>
                      <CommentFields
                        el={el}
                        answer={false}
                        postTime={postTime}
                      />
                    </div>
                  );
                })}

                {answerPressed === index ? (
                  <div className={styles.postCommentOfComment}>
                    <img
                      src={user?.picture}
                      className={styles.postCommentOfCommentPicture}
                    />
                    <input
                      className={styles.addCommentOfComment}
                      onChange={commentChange}
                      value={commentOfCommentContent}
                      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                        handleKeyDown(e, "commentOfComment", el._id)
                      }
                    />
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
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
              handleKeyDown(e, "comment")
            }
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
