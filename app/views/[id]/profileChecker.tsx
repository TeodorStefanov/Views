"use client";
import React, { FC, useContext, useEffect, useState } from "react";
import ModalProfilePicture from "../../../components/modalProfilePicture";
import { calculateDateOrTime } from "../../../utils/calculateDateOrTime";
import ModalOpenComments from "../../../components/modalOpenComments";
import ModalOpenLikes from "../../../components/modalOpenLikes";
import { likeExists } from "../../../utils/checkLiked";
import UserContext from "../../../context/context";
import AddPost from "../../../components/addPost";
import type { Socket } from "socket.io-client";
import Post from "../../../components/post";
import { useRouter } from "next/navigation";
import styles from "./id.module.css";
import io from "socket.io-client";
import Image from "next/image";
import {
  handleChangeBackgroundPicture,
  handleChangeProfilePicture,
  handleClickPicture,
  handleClickVideo,
} from "../../../utils/cloudinary";

import {
  handleClickPost,
  addLike,
  deleteLike,
  handleSubmitComment,
  handleSubmitCommentOfComment,
  handleClickFollowFriend,
  handleAcceptFriendRequest,
} from "../../../utils/socket/socketEmits";
import {
  Comment,
  FriendNotification,
  Notification,
  Posts,
  PostsType,
  UserData,
} from "../../../utils/types";
let socket: undefined | Socket;

const ProfileChecker: FC<UserData> = ({
  _id,
  backgroundPicture,
  picture,
  viewsName,
  friends,
  posts,
}: UserData) => {
  const [openLikesPressed, setOpenLikesPressed] = useState<UserData[] | []>([]);
  const [openCommentsPressed, setOpenCommentsPressed] = useState<PostsType>();
  const [sentFriendRequest, setSentFriendRequest] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<boolean>(false);
  const [contentComment, setContentComment] = useState<string>("");
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const [allPosts, setAllPosts] = useState<PostsType[]>(posts);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [postId, setPostId] = useState<string>("");
  const [commentOfCommentContent, setCommentOfCommentContent] =
    useState<string>("");
  const [receivedFriendRequest, setReceivedFriendRequest] =
    useState<string>("");
  const [newBackgroundPicture, setNewBackgroundPicture] =
    useState<string>(backgroundPicture);
  const [newPicture, setNewPicture] = useState<string>(picture);
  const context = useContext(UserContext);
  const { user, logIn } = context;
  const router = useRouter();

  const openLikes = async (post: PostsType | Comment) => {
    setOpenLikesPressed(post.likes);
  };
  const openComments = async (post: PostsType) => {
    setOpenCommentsPressed(post);
    setPostId(post._id);
  };
  const socketInitializer = async () => {
    socket = io();
    socket.emit("login", user?._id);
    socket.emit("joinRoom", _id);
    socket.on("allPosts", (posts: PostsType[]) => {
      setAllPosts(posts);
    });
    socket.on("addLike", (post: PostsType[]) => {
      setAllPosts(post);
    });
    socket.on("allComments", (posts: Posts) => {
      setOpenCommentsPressed(posts.post);
      setAllPosts(posts.postsUser);
    });
    socket.on("sentFriendRequest", (user: UserData) => {
      logIn(user);
      setSentFriendRequest(true);
    });
    socket.on("friendNotification", (user: FriendNotification) => {
      logIn(user.friendUser);
      setReceivedFriendRequest(user.notificationId);
    });

    socket.on("likeToComment", (posts: Posts) => {
      setOpenCommentsPressed(posts.post);
      setAllPosts(posts.postsUser);
    });
    socket.on("changeBackgroundPicture", (user: UserData) => {
      logIn(user);
      setNewBackgroundPicture(user.backgroundPicture);
    });
    socket.on("changeProfilePicture", (user: UserData) => {
      logIn(user);
      setNewPicture(user.picture);
      setAllPosts(user.posts.reverse());
    });
    return null;
  };
  useEffect(() => {
    setReceivedFriendRequest("");
    setSentFriendRequest(false);
    const friend = user?.friends.find((el: UserData) => el._id === _id);
    if (user?._id === _id) {
      setLoggedUser(true);
      setIsFriend(true);
    }
    if (friend) {
      setIsFriend(true);
    }

    user?.notifications?.map((el: Notification) => {
      if (el.sentBy._id === _id && el.content === "Friend request") {
        setReceivedFriendRequest(el._id);
      }
    });
    user?.friendRequests?.map((el: UserData) => {
      if (el._id === _id) {
        setSentFriendRequest(true);
      }
    });
    socketInitializer();
  }, [user]);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.left}></div>
        <div className={styles.middle}>
          <div className={styles.top}>
            <div
              style={{
                backgroundImage: `url(${newBackgroundPicture})`,
              }}
              className={styles.backgroundPicture}
            >
              {loggedUser ? (
                <div
                  className={styles.addBackgroundPicture}
                  onClick={() => handleChangeBackgroundPicture(user!._id)}
                >
                  <div className={styles.backgroundPictureButton}>
                    Change cover picture
                  </div>
                  <div className={styles.backgroundPictureOverlay}></div>
                </div>
              ) : (
                ""
              )}
            </div>
            <Image
              src={newPicture}
              className={styles.picture}
              onClick={() => setProfilePicture(true)}
              alt="pic"
              width={200}
              height={200}
            />
            <p className={styles.viewsName}>{viewsName}</p>
            {!loggedUser && !isFriend ? (
              receivedFriendRequest ? (
                <button
                  className={styles.follow}
                  onClick={() => {
                    handleAcceptFriendRequest(
                      user!._id,
                      _id,
                      receivedFriendRequest
                    );
                    setReceivedFriendRequest("");
                  }}
                >
                  Accept
                </button>
              ) : sentFriendRequest ? (
                <div className={styles.pandingFriend}>Panding</div>
              ) : (
                <button
                  type="button"
                  className={styles.follow}
                  onClick={() => {
                    handleClickFollowFriend(user!._id, _id);
                  }}
                >
                  Follow
                </button>
              )
            ) : (
              ""
            )}
          </div>
          <div className={styles.middleDescription}>
            <div>Description</div>
            {user!._id === _id ? (
              <div
                className={styles.changeProfilePicture}
                onClick={() => handleChangeProfilePicture(user!._id)}
              >
                Change profile Picture
              </div>
            ) : (
              ""
            )}
            <p className={styles.friendsCount}>{friends.length} Friends</p>
            {friends.length > 0
              ? friends.map((el: UserData, index) => {
                  if (index >= 5) {
                    return;
                  }
                  return (
                    <Image
                      className={styles.friendPicture}
                      src={el.picture}
                      width={200}
                      height={200}
                      alt=""
                      key={index}
                      onClick={() => router.push(`/views/${el._id}`)}
                    />
                  );
                })
              : ""}
          </div>
          <div className={styles.content}>
            {isFriend ? (
              <AddPost
                picture={user!.picture}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setContent(e.target.value)
                }
                handleClickPicture={() => handleClickPicture(setImageUrl)}
                handleClickVideo={() => handleClickVideo(setVideoUrl)}
                handleClickPost={() => {
                  handleClickPost(_id, user!._id, content, imageUrl, videoUrl);
                  setContent(""), setImageUrl("");
                  setVideoUrl("");
                }}
                value={content}
              />
            ) : (
              ""
            )}
            {allPosts.map((post, index) => {
              const postTime = calculateDateOrTime(post.createdAt);
              const liked = likeExists(post, user!._id);
              return (
                <Post
                  key={index}
                  post={post}
                  postTime={postTime}
                  liked={liked}
                  addLike={() => addLike(user!._id, post._id, _id)}
                  deleteLike={() => deleteLike(user!._id, post._id, _id)}
                  openLikes={() => openLikes(post)}
                  openComments={() => openComments(post)}
                  handleClick={(e) => {
                    e.preventDefault();
                    if (post.createdBy._id !== user!._id) {
                      window.scrollTo(0, 0);
                    } else {
                      router.push(`/views/${post.createdBy._id}`);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.UserData}></div>
        <div className={styles.right}>
          <div className={styles.contacts}>
            <p className={styles.contactsTitle}>Contacts</p>
            {friends.map((el: UserData) => {
              return (
                <div
                  className={styles.contactsPictureName}
                  onClick={() => router.push(`/views/${el._id}`)}
                >
                  <Image
                    src={el.picture}
                    className={styles.contentPicture}
                    width={200}
                    height={200}
                    alt="pic"
                  />{" "}
                  {el.viewsName}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {profilePicture ? (
        <ModalProfilePicture
          picture={newPicture}
          onClick={() => setProfilePicture(false)}
        />
      ) : (
        ""
      )}
      {openLikesPressed.length > 0 ? (
        <ModalOpenLikes
          users={openLikesPressed}
          onClick={() => setOpenLikesPressed([])}
          id={_id}
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
          handleSubmit={() => {
            handleSubmitComment(user?._id, postId, contentComment, _id);
            setContentComment("");
          }}
          handleSubmitCommentOfComment={(id, postId) => {
            handleSubmitCommentOfComment(
              user!._id,
              id,
              postId,
              commentOfCommentContent,
              _id
            );
            setCommentOfCommentContent("");
          }}
          commentChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCommentOfCommentContent(e.target.value)
          }
          openLikeModal={(like) => {
            openLikes(like);
          }}
          id={_id}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ProfileChecker;
