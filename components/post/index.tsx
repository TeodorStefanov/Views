import React from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";
import { PostsType } from "../../utils/types"

interface fields {
  post: PostsType;
  postTime: string;
  liked: boolean;
  addLike: (e: React.MouseEvent) => void;
  deleteLike: (e: React.MouseEvent) => void;
  openLikes: (e: React.MouseEvent) => void;
  openComments: (e: React.MouseEvent) => void;
  handleClick: (e: React.MouseEvent) => void;
}
const Post = ({
  post,
  postTime,
  liked,
  addLike,
  deleteLike,
  openLikes,
  openComments,
  handleClick,
}: fields) => {
  const calculateComments = () => {
    let totalComments = 0;
    post.comments.map((el) => {
      totalComments += el.comments.length;
    });
    return totalComments;
  };
  return (
    <div className={styles.postContainer}>
      <div className={styles.postContent}>
        <img
          src={post.createdBy.picture}
          className={styles.postUserPicture}
          onClick={handleClick}
        />
        <p>
          <b onClick={handleClick} className={styles.viewsName}>
            {post.createdBy.viewsName}
          </b>{" "}
          -{" "}
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
          <div>
            {post.likes.length > 0 ? (
              <div onClick={openLikes}>
                <FontAwesomeIcon
                  className={styles.likeMark}
                  icon={faThumbsUp}
                />
                {post.likes.length}
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            {post.comments.length > 0 ? (
              <div onClick={openComments}>
                <FontAwesomeIcon className={styles.likeMark} icon={faComment} />
                {post.comments.length + calculateComments()}
              </div>
            ) : (
              ""
            )}
          </div>
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
              <FontAwesomeIcon
                className={styles.unLikeMark}
                icon={faThumbsUp}
              />
              Like
            </div>
          )}
          <div className={styles.buttonComment} onClick={openComments}>
            <FontAwesomeIcon className={styles.likeMark} icon={faComment} />
            Comment
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
