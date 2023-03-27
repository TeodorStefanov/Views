import React, { useState, useContext, useRef, useEffect } from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Comment, PostsType } from "../../app/views/[id]/profileChecker";
import UserContext from "../../context/context";
import { calculateDateOrTime } from "../../utils/calculateDateOrTime";
import CommentFields from "../commentFields";
import { likeExists } from "../../utils/checkLiked";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";
let socket: undefined | Socket;
type Fields = {
  post: PostsType | undefined;
  onClick: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => Promise<void>;
  handleSubmitCommentOfComment: (id: string, postId: string) => void;
  commentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  commentOfCommentContent: string;
  setResult: (result: PostsType) => void;
  openLikeModal: (like: Comment) => void;
  id: string;
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
  openLikeModal,
  id,
}: Fields) => {
  const context = useContext(UserContext);
  const { user } = context;
  const [answerPressed, setAnswerPressed] = useState<number>();
  const [commentsToCommentsChanged, setCommentsToCommentsChanged] =
    useState<boolean>(false);
  const container = useRef<HTMLInputElement>(null);
  const addLike = async (
    event: React.MouseEvent,
    commentId: string,
    postId: string
  ) => {
    event.preventDefault();
    const userId = user?._id;
    socket = io()
    if (socket !== undefined) {
      socket.emit("addLikeToComment", commentId, userId, postId, id);
    }
    setCommentsToCommentsChanged(true);
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
      setCommentsToCommentsChanged(true);
    } else {
      alert("There is an error!");
    }
  };
  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLDivElement>,
    comment: string,
    id?: string
  ) => {
    if (e.key === "Enter") {
      if (comment === "comment") {
        await handleSubmit();
      } else if (comment === "commentOfComment") {
        handleSubmitCommentOfComment(id!, post!._id);
        setCommentsToCommentsChanged(true);
      }
    }
  };
  useEffect(() => {
    if (container.current != null && !commentsToCommentsChanged) {
      container.current.scrollTop = container.current?.scrollHeight;
    }
    setCommentsToCommentsChanged(false);
  }, [post]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.comments} ref={container}>
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
                  openLikeModal={openLikeModal}
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
                        openLikeModal={openLikeModal}
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
                      autoFocus
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
            autoFocus
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
