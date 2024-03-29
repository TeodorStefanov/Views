import React, { useState, useContext, useRef, useEffect } from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Comment, PostsType } from "../../utils/types";
import UserContext from "../../context/context";
import { calculateDateOrTime } from "../../utils/calculateDateOrTime";
import CommentFields from "../commentFields";
import { likeExists } from "../../utils/checkLiked";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import Image from "next/image";
let socket: undefined | Socket;
type Fields = {
  post: PostsType | undefined;
  onClick: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (id: string) => void;
  handleSubmitCommentOfComment: (
    id: string,
    postId: string,
    userId: string
  ) => void;
  commentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  commentOfCommentContent: string;

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
    socket = io();
    if (socket !== undefined) {
      socket.emit("likeToComment", commentId, userId, postId, id, "add");
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
    socket = io();
    if (socket !== undefined) {
      socket.emit("likeToComment", commentId, userId, postId, id, "delete");
    }

    setCommentsToCommentsChanged(true);
  };
  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLDivElement>,
    comment: string,
    userId?: string
  ) => {
    if (e.key === "Enter") {
      if (comment === "comment") {
        handleSubmit(userId!);
      } else if (comment === "commentOfComment") {
        handleSubmitCommentOfComment(userId!, post!._id, post!.createdTo._id);
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
                    <Image
                      src={user!.picture}
                      className={styles.postCommentOfCommentPicture}
                      width={200}
                      height={200}
                      alt="pic"
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
          <Image
            src={user!.picture}
            className={styles.postPicture}
            width={200}
            height={200}
            alt="pic"
          />
          <input
            className={styles.addComment}
            onChange={onChange}
            value={value}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
              handleKeyDown(e, "comment", post?.createdTo._id)
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
