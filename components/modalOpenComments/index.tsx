import React, { useState, useContext, useTransition } from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { user2 } from "../../app/views/[id]/profileChecker";
import UserContext from "../../context/context";
import { useRouter } from "next/navigation";
type fields = {
  comments: { user: user2; content: string }[] | [];
  onClick: () => void;
  id: string;
};
const ModalOpenComments = ({ comments, onClick, id }: fields) => {
  const router = useRouter();
  const context = useContext(UserContext);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const { user } = context;
  const handleSubmit = async () => {
    const promise = await fetch(
      "http://localhost:3000/api/createCommentUpdatePost",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?._id, id, content }),
      }
    );
    const result = await promise.json();
    if (promise.status === 200) {
      startTransition(() => {
        setContent("");
        router.refresh();
      });
    }
  };
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
                  <div className={styles.likeComment}>Comment</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.postComment}>
          <img src={user?.picture} className={styles.postPicture} />
          <input
            className={styles.addComment}
            onChange={(e) => setContent(e.target.value)}
            value={content}
            onSubmit={handleSubmit}
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
