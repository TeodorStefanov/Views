"use client";
import React, { useContext, useState, useEffect } from "react";
import { handleClickPicture, handleClickVideo } from "../../utils/cloudinary";
import { Comment, Posts, PostsType, UserData } from "../../utils/types";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { calculateDateOrTime } from "../../utils/calculateDateOrTime";
import ModalOpenComments from "../../components/modalOpenComments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalOpenLikes from "../../components/modalOpenLikes";
import { useForm, SubmitHandler } from "react-hook-form";
import { likeExists } from "../../utils/checkLiked";
import UserContext from "../../context/context";
import type { Socket } from "socket.io-client";
import AddPost from "../../components/addPost";
import getNavigation from "../../navigation";
import { useRouter } from "next/navigation";
import Post from "../../components/post";
import styles from "./index.module.css";
import { io } from "socket.io-client";
import {
  handleClickPost,
  addLike,
  deleteLike,
  handleSubmitComment,
  handleSubmitCommentOfComment,
} from "../../utils/socket/socketEmits";
let socket: undefined | Socket;
interface IFormInputs {
  searchMenu: string;
}
const ViewsPage = ({ posts }: any) => {
  const [openLikesPressed, setOpenLikesPressed] = useState<UserData[] | []>([]);
  const [openCommentsPressed, setOpenCommentsPressed] = useState<PostsType>();
  const [pressedButton, setPressedButton] = useState<string>("All");
  const [contentComment, setContentComment] = useState<string>("");
  const [postId, setPostId] = useState<PostsType | "">("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [allPosts, setAllPosts] = useState<PostsType[]>(posts);
  const [commentOfCommentContent, setCommentOfCommentContent] =
    useState<string>("");
  const context = useContext(UserContext);
  const router = useRouter();
  const { user } = context;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const links = getNavigation();
  const handleClick = () => {};

  const socketInitializer = async () => {
    socket = io();
    socket.emit("main");
    socket.on("posts", (posts: PostsType[]) => {
      setAllPosts(posts);
    });
    socket.on("likes", (post: PostsType[]) => {
      setAllPosts(post);
    });
    socket.on("allComments", (posts: Posts) => {
      setOpenCommentsPressed(posts.post);
      setAllPosts(posts.posts);
    });
    socket.on("likeToComment", (posts: Posts) => {
      setOpenCommentsPressed(posts.post);
      setAllPosts(posts.posts);
    });
  };
  const openLikes = async (post: PostsType | Comment) => {
    setOpenLikesPressed(post.likes);
  };
  const openComments = async (post: PostsType) => {
    setOpenCommentsPressed(post);
    setPostId(post);
  };
  useEffect(() => {
    socketInitializer();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.left}></div>
      <div className={styles.middle}>
        <div>
          <label htmlFor="searchMenu">
            <input
              {...register("searchMenu")}
              id="searchMenu"
              type="text"
              placeholder="Search in Views"
              className={styles.searchMenu}
            />
          </label>
          <FontAwesomeIcon
            className={styles.searchButton}
            icon={faMagnifyingGlass}
            onClick={handleClick}
          />
        </div>
        <div className={styles.navigation}>
          {links.map((el, index) => {
            return (
              <div
                className={`${styles.navigationLink} ${
                  pressedButton === el.title ? styles.pressedButton : ""
                }`}
                key={index}
                onClick={(e) => setPressedButton(el.title)}
              >
                {el.title}
              </div>
            );
          })}
        </div>
        <div className={styles.share}>
          <AddPost
            picture={user!.picture}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setContent(e.target.value)
            }
            handleClickPicture={() => handleClickPicture(setImageUrl)}
            handleClickVideo={() => handleClickVideo(setVideoUrl)}
            handleClickPost={() => {
              handleClickPost(
                user!._id,
                user!._id,
                content,
                imageUrl,
                videoUrl
              );
              setContent(""), setImageUrl("");
              setVideoUrl("");
            }}
            value={content}
          />
        </div>
        {allPosts.map((post, index) => {
          const postTime = calculateDateOrTime(post.createdAt);
          const liked = likeExists(post, user!._id);
          return (
            <Post
              key={index}
              post={post}
              postTime={postTime}
              liked={liked}
              addLike={() => addLike(user!._id, post._id, post.createdBy._id)}
              deleteLike={() =>
                deleteLike(user!._id, post._id, post.createdBy._id)
              }
              openLikes={() => openLikes(post)}
              openComments={() => openComments(post)}
              handleClick={(e) => {
                e.preventDefault();
                router.push(`/views/${post.createdBy._id}`);
              }}
            />
          );
        })}
        {openLikesPressed.length > 0 ? (
          <ModalOpenLikes
            users={openLikesPressed}
            onClick={() => setOpenLikesPressed([])}
            id={"no"}
          />
        ) : (
          ""
        )}
        {postId ? (
          <ModalOpenComments
            post={openCommentsPressed}
            onClick={() => setPostId("")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setContentComment(e.target.value)
            }
            value={contentComment}
            commentOfCommentContent={commentOfCommentContent}
            handleSubmit={(roomId) => {
              handleSubmitComment(
                user?._id,
                postId._id,
                contentComment,
                roomId
              );
              setContentComment("");
            }}
            handleSubmitCommentOfComment={(id, postId, roomId) => {
              handleSubmitCommentOfComment(
                user!._id,
                id,
                postId,
                commentOfCommentContent,
                roomId
              );
              setCommentOfCommentContent("");
            }}
            commentChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCommentOfCommentContent(e.target.value)
            }
            openLikeModal={(like) => {
              openLikes(like);
            }}
            id={postId.createdTo._id}
          />
        ) : (
          ""
        )}
      </div>
      <div className={styles.right}></div>
    </div>
  );
};

export default ViewsPage;
