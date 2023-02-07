import React from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";
import { posts } from "../../app/views/[id]/profileChecker";
interface fields {
  post: posts;
  picture: string;
  viewsName: string;
  postTime: string;
  liked: boolean;
  addLike: (e: React.MouseEvent) => void;
  deleteLike: (e: React.MouseEvent) => void;
}
const Post = ({
  post,
  picture,
  viewsName,
  postTime,
  liked,
  addLike,
  deleteLike,
}: fields) => {
  return (
    <div className={styles.postContainer}>
      <div className={styles.postContent}>
        <img src={picture} className={styles.postUserPicture} />
        <p>
          <b>{viewsName}</b> -{" "}
        </p>
        <p className={styles.postTime}>{postTime}</p>
      </div>
      {post.content ? (
        <p className={styles.postTextContent}>{post.content}</p>
      ) : (
        ""
      )}
      {post.imageUrl ? (
        <img src={post.imageUrl} className={styles.postImageUrl} />
      ) : (
        ""
      )}
      {post.videoUrl ? (
        <video
          width="380"
          height="380"
          className={styles.postVideoUrl}
          autoPlay={true}
          loop
          muted
        >
          <source src={post.videoUrl} type="video/mp4" />
        </video>
      ) : (
        ""
      )}

      <div className={styles.likes}>
        <div className={styles.markCount}>
          <FontAwesomeIcon className={styles.likeMark} icon={faThumbsUp} />
          {post.likes.length}
        </div>
      </div>
      <div className={styles.mainLikeCommentButtons}>
        <div className={styles.likeCommentButtons}>
          {!liked ? (
            <div className={styles.buttonLike} onClick={addLike}>
              <FontAwesomeIcon className={styles.likeMark} icon={faThumbsUp} />
              Like
            </div>
          ) : (
            <div className={styles.buttonUnLike} onClick={deleteLike}>
              <FontAwesomeIcon className={styles.likeMark} icon={faThumbsUp} />
              Like
            </div>
          )}
          <div className={styles.buttonComment}>
            <FontAwesomeIcon className={styles.likeMark} icon={faComment} />
            Comment
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
