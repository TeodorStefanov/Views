import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";
import { posts } from "../../app/views/[id]/profileChecker";
import { user } from "../../app/views/[id]/page";
import { useRouter } from "next/navigation";
interface fields {
  post: posts;
  picture: string;
  viewsName: string;
  postTime: string;
  liked: boolean;
  addLike: (e: React.MouseEvent) => void;
  deleteLike: (e: React.MouseEvent) => void;
  addComment: (e: React.MouseEvent) => void;
  likedUsers: (e: React.MouseEvent) => void;
}
const Post = ({
  post,
  picture,
  viewsName,
  postTime,
  liked,
  addLike,
  deleteLike,
  addComment,
  likedUsers,
}: fields) => {
  const [postLiked, setPostLiked] = useState<user[] | []>([]);
  const [postComments, setPostComments] = useState<user[] | []>([]);
  const router = useRouter();
  const getLikedUser = async () => {
    console.log(post.likes);
    const promise = await fetch(
      "http://localhost:3000/api/getLikedAndCommentsUser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: post.likes, comments: post.comments }),
      }
    );
    const { likedUser, commentsUser } = await promise.json();

    setPostLiked(likedUser);
    setPostComments(commentsUser);
    router.push("/");
  };

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
          <div>
            {post.likes.length > 0 ? (
              <div onClick={likedUsers}>
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
              <div>
                <FontAwesomeIcon className={styles.likeMark} icon={faComment} />
                {post.comments.length}
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
          <div className={styles.buttonComment} onClick={addComment}>
            <FontAwesomeIcon className={styles.likeMark} icon={faComment} />
            Comment
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
