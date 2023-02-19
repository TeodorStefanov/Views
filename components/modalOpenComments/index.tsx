import React, { useState, useContext, useTransition } from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PostsType } from "../../app/views/[id]/profileChecker";
import UserContext from "../../context/context";
import { calculateDateOrTime } from "../../utils/calculateDateOrTime";
import CommentFields from "../commentFields";
import { likeExists } from "../../utils/checkLiked";
type Fields = {
  post: PostsType | undefined;
  onClick: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  handleSubmitCommentOfComment: (id: string, postId: string) => void;
  commentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  commentOfCommentContent: string;
  setResult: (result: PostsType) => void;
};
const ModalOpenComments = ({
  post,
  onClick,
  value,
  onChange,
  handleSubmit,
  handleSubmitCommentOfComment,
  commentChange,
  commentOfCommentContent,
  setResult,
}: Fields) => {
  const context = useContext(UserContext);
  const { user } = context;
  const [answerPressed, setAnswerPressed] = useState<number>();
  const addLike = async (
    event: React.MouseEvent,
    commentId: string,
    postId: string
  ) => {
    event.preventDefault();
    const userId = user?._id;
    const promise = await fetch("http://localhost:3000/api/addLikeToComment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId, userId, postId }),
    });
    if (promise.status === 200) {
      const result = await promise.json();
      setResult(result);
    } else {
      alert("There is an error!");
    }
  };
  const deleteLike = async (
    event: React.MouseEvent,
    commentId: string,
    postId: string
  ) => {
    event.preventDefault();
    const userId = user?._id;

    const promise = await fetch(
      "http://localhost:3000/api/deleteLikeToComment",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId, userId, postId }),
      }
    );
    if (promise.status === 200) {
      const result = await promise.json();
      setResult(result);
    } else {
      alert("There is an error!");
    }
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    comment: string,
    id?: string
  ): void => {
    if (e.key === "Enter") {
      if (comment === "comment") {
        handleSubmit();
      } else if (comment === "commentOfComment") {
        handleSubmitCommentOfComment(id!, post!._id);
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.comments}>
          {post?.comments.map((el, index) => {
            let liked = likeExists(el, user!._id);
            const postTime = calculateDateOrTime(el.createdAt);
            return (
              <div className={styles.comment} key={index}>
                <CommentFields
                  el={el}
                  answer={true}
                  postTime={postTime}
                  onClick={() => setAnswerPressed(index)}
                  onClickLike={(e: React.MouseEvent) =>
                    addLike(e, el._id, post._id)
                  }
                  onClickDeleteLike={(e: React.MouseEvent) =>
                    deleteLike(e, el._id, post._id)
                  }
                  liked={liked}
                />
                {el.comments.map((el, index) => {
                  let liked = likeExists(el, user!._id);
                  const postTime = calculateDateOrTime(el.createdAt);
                  return (
                    <div className={styles.commentOfComment} key={index}>
                      <CommentFields
                        el={el}
                        answer={false}
                        postTime={postTime}
                        onClickLike={(e: React.MouseEvent) =>
                          addLike(e, el._id, post._id)
                        }
                        onClickDeleteLike={(e: React.MouseEvent) =>
                          deleteLike(e, el._id, post._id)
                        }
                        liked={liked}
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
