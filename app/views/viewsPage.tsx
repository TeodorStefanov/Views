"use client";
import React, { FC, useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./index.module.css";
import getNavigation from "../../navigation";
import { Comment, PostsType, UserData } from "./[id]/profileChecker";
import { calculateDateOrTime } from "../../utils/calculateDateOrTime";
import { likeExists } from "../../utils/checkLiked";
import UserContext from "../../context/context";
import Post from "../../components/post";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import ModalOpenLikes from "../../components/modalOpenLikes";
import ModalOpenComments from "../../components/modalOpenComments";
import AddPost from "../../components/addPost";
import { handleClickPicture, handleClickVideo } from "../../utils/cloudinary";
let socket: undefined | Socket;
interface IFormInputs {
  searchMenu: string;
}
const ViewsPage = ({ posts }: any) => {
  const [pressedButton, setPressedButton] = useState<string>("All");
  const [allPosts, setAllPosts] = useState<PostsType[]>(posts);
  const [openLikesPressed, setOpenLikesPressed] = useState<UserData[] | []>([]);
  const [openCommentsPressed, setOpenCommentsPressed] = useState<PostsType>();
  const [contentComment, setContentComment] = useState<string>("");
  const [commentOfCommentContent, setCommentOfCommentContent] =
    useState<string>("");
  const [postId, setPostId] = useState<PostsType | "">("");
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
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
  const handleClickPost = async (e: React.MouseEvent) => {
    e.preventDefault();
    const userId = user?._id
    const createdBy = user?._id;
    if (content || imageUrl || videoUrl) {
      if (socket !== undefined) {
        socket.emit("allPosts", userId, content, imageUrl, videoUrl, createdBy);
        setContent("");
        setImageUrl("");
        setVideoUrl("");
      }
    }
  };
  const addLike = (
    event: React.MouseEvent,
    postId: string,
    createdBy: string
  ) => {
    event.preventDefault();
    const userId = user?._id;

    if (socket !== undefined) {
      socket.emit("addLike", postId, userId, "add", createdBy);
    }
  };
  const deleteLike = (
    event: React.MouseEvent,
    postId: string,
    createdBy: string
  ) => {
    event.preventDefault();
    const userId = user?._id;

    if (socket !== undefined) {
      socket.emit("addLike", postId, userId, "delete", createdBy);
    }
  };
  const handleSubmitComment = async (
    roomId: string,
    userId: string | undefined,
    id: string,
    contentComment: string
  ) => {
    if (contentComment) {
      if (socket !== undefined) {
        socket.emit("allComments", userId, id, contentComment, roomId);
        setContentComment("");
      }
    }
  };
  const handleSubmitCommentOfComment = async (
    id: string,
    postId: string,
    roomId: string
  ) => {
    const userId = user?._id;
    if (commentOfCommentContent) {
      if (socket !== undefined) {
        socket.emit(
          "allComments",
          userId,
          id,
          commentOfCommentContent,
          roomId,
          postId
        );
        setCommentOfCommentContent("");
      }
    }
  };
  const socketInitializer = async () => {
    socket = io();
    socket.emit("main");
    socket.on("posts", (posts) => {
      setAllPosts(posts);
    });
    socket.on("likes", (post) => {
      setAllPosts(post);
    });
    socket.on("allComments", (posts) => {
      setOpenCommentsPressed(posts.post);
      setAllPosts(posts.posts);
    });
    socket.on("likeToComment", (posts) => {
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
            handleClickPost={handleClickPost}
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
              addLike={(e: React.MouseEvent) =>
                addLike(e, post._id, post.createdBy._id)
              }
              deleteLike={(e: React.MouseEvent) =>
                deleteLike(e, post._id, post.createdBy._id)
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
            handleSubmit={async (roomId) =>
              await handleSubmitComment(
                roomId,
                user?._id,
                postId._id,
                contentComment
              )
            }
            handleSubmitCommentOfComment={(id, postId, roomId) =>
              handleSubmitCommentOfComment(id, postId, roomId)
            }
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
