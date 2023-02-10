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
  const [comment, setComment] = useState("");
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
        body: JSON.stringify({ userId: user?._id, id, comment }),
      }
    );
    const result = await promise.json();
    if (promise.status === 200) {
      startTransition(() => {
        setComment("");
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
          <div className={styles.comment}>
            {comments.map((el, index) => {
              return (
                <div key={index}>
                  <div>
                    <img src={el.user.picture} />
                    <div>
                      {el.user.viewsName}
                      <p>{el.content}</p>
                    </div>
                  </div>
                  <div>
                    <button>Like</button>
                    <button>Comment</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.postComment}>
          <img src={user?.picture} className={styles.postPicture} />
          <input
            className={styles.addComment}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
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
