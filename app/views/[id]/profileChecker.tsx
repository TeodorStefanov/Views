"use client";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../../context/context";
import styles from "./id.module.css";
import Post from "../../../components/post";
import AddPost from "../../../components/addPost";
import ModalProfilePicture from "../../../components/modalProfilePicture";
import ModalOpenLikes from "../../../components/modalOpenLikes";
import ModalOpenComments from "../../../components/modalOpenComments";
import { calculateDateOrTime } from "../../../utils/calculateDateOrTime";
import { likeExists } from "../../../utils/checkLiked";
import { useRouter } from "next/navigation";
export type PostsType = {
  _id: string;
  content: string;
  imageUrl: string;
  videoUrl: string;
  createdAt: Date;
  createdBy: UserData;
  likes: Array<UserData>;
  comments: Array<Comment> | [];
};
export interface Comment {
  _id: string;
  user: UserData;
  content: string;
  createdAt: Date;
  likes: Array<UserData> | [];
  comments: Array<Comment> | [];
}
export interface UserData {
  _id: string;
  backgroundPicture: string;
  picture: string;
  viewsName: string;
  friends: UserData[] | [];
  friendRequests?: UserData[] | [];
  posts: PostsType[];
  notifications?: Notification[] | [];
}
export type Notification = {
  _id: string;
  sentBy: UserData;
  setnTo: UserData;
  content: string;
  checked: boolean;
  pressed: boolean;
};
const ProfileChecker = ({
  _id,
  backgroundPicture,
  picture,
  viewsName,
  friends,
  posts,
}: UserData) => {
  const context = useContext(UserContext);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<boolean>(false);
  const { user, logIn } = context;
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [openLikesPressed, setOpenLikesPressed] = useState<UserData[] | []>([]);
  const [openCommentsPressed, setOpenCommentsPressed] = useState<PostsType>();
  const [postId, setPostId] = useState<string>("");
  const [contentComment, setContentComment] = useState<string>("");
  const [allPosts, setAllPosts] = useState<PostsType[]>(posts);
  const [commentOfCommentContent, setCommentOfCommentContent] =
    useState<string>("");
  const [receivedFriendRequest, setReceivedFriendRequest] =
    useState<string>('');
  const [sentFriendRequest, setSentFriendRequest] = useState<boolean>(false);
  const router = useRouter();
  const handleClickPicture = (e: React.MouseEvent) => {
    e.preventDefault();
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "daqcaszkf",
        uploadPreset: "softuni",
      },
      (error: any, result: any) => {
        if (error) {
          console.log("Error:", error);
        }
        if (result.event === "success") {
          setImageUrl(result.info.url);
        }
      }
    );
    widget.open();
  };
  const handleClickVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "daqcaszkf",
        uploadPreset: "softuni",
      },
      (error: any, result: any) => {
        if (error) {
          console.log("Error:", error);
        }
        if (result.event === "success") {
          setVideoUrl(result.info.url);
        }
      }
    );
    widget.open();
  };
  const handleClickPost = async (e: React.MouseEvent) => {
    e.preventDefault();
    const promise = await fetch("http://localhost:3000/api/newCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: _id,
        content,
        imageUrl,
        videoUrl,
        createdBy: user!._id,
      }),
    });
    if (promise.status === 200) {
      const result = await promise.json();
      setContent("");
      setImageUrl("");
      setVideoUrl("");
      setAllPosts(result);
    }
  };
  const addLike = async (event: React.MouseEvent, postId: string) => {
    event.preventDefault();
    const userId = user?._id;
    const promise = await fetch("http://localhost:3000/api/addLikeToPost", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId }),
    });
    if (promise.status === 200) {
      const result = await promise.json();
      const newPosts = allPosts.map((el: PostsType) =>
        el._id === result._id ? result : el
      );

      setAllPosts(newPosts);
    }
  };
  const deleteLike = async (event: React.MouseEvent, postId: string) => {
    event.preventDefault();
    const userId = user?._id;
    const promise = await fetch("http://localhost:3000/api/deleteLikeToPost", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId }),
    });
    if (promise.status === 200) {
      const result = await promise.json();
      const newPosts = allPosts.map((el: PostsType) =>
        el._id === result._id ? result : el
      );
      setAllPosts(newPosts);
    }
  };
  const handleSubmitComment = async (
    userId: string | undefined,
    id: string,
    contentComment: string
  ) => {
    if (contentComment) {
      const promise = await fetch(
        "http://localhost:3000/api/createCommentUpdatePost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, id, contentComment }),
        }
      );
      if (promise.status === 200) {
        const result = await promise.json();
        const newPosts = allPosts.map((el: PostsType) =>
          el._id === result._id ? result : el
        );
        setContentComment("");
        setOpenCommentsPressed(result);
        setAllPosts(newPosts);
      } else {
        alert("There is an error");
      }
    }
  };
  const handleSubmitCommentOfComment = async (id: string, postId: string) => {
    const userId = user?._id;
    const promise = await fetch(
      "http://localhost:3000/api/addCommentOfComment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          userId,
          content: commentOfCommentContent,
          postId,
        }),
      }
    );
    if (promise.status === 200) {
      const result = await promise.json();
      const newPosts = allPosts.map((el: PostsType) =>
        el._id === result._id ? result : el
      );
      setCommentOfCommentContent("");
      setOpenCommentsPressed(result);
      setAllPosts(newPosts);
    } else {
      alert("There is an error");
    }
  };
  const handleClickFollowFriend = async () => {
    const promise = await fetch(
      "http://localhost:3000/api/createFriendRequestNotification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user!._id, friendId: _id }),
      }
    );
    if (promise.status === 200) {
      const result = await promise.json();
      logIn(result);
    }
  };
  const handleAcceptFriendRequest = async () => {
    const promise = await fetch(
      "http://localhost:3000/api/acceptFriendRequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?._id, idFriend: _id, notificationId: receivedFriendRequest}),
      }
    );
    if (promise.status === 200) {
      const result = await promise.json();
      setIsFriend(true);
      setReceivedFriendRequest('');
      console.log(isFriend);
      logIn(result);
    }
  };
  const openLikes = async (post: PostsType | Comment) => {
    setOpenLikesPressed(post.likes);
  };
  const openComments = async (post: PostsType) => {
    setOpenCommentsPressed(post);
    setPostId(post._id);
  };
  useEffect(() => {
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
    user?.friendRequests?.map((el) => {
      if (el._id === _id) { 
        setSentFriendRequest(true);
      }
    });
  }, [user]);
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.left}></div>
        <div className={styles.middle}>
          <div className={styles.top}>
            <div
              style={{
                backgroundImage: `url(${backgroundPicture})`,
              }}
              className={styles.topPicture}
            >
              {loggedUser ? (
                <div className={styles.topAddPicture}>Add cover picture</div>
              ) : (
                ""
              )}
            </div>
            <img
              src={picture}
              className={styles.picture}
              onClick={() => setProfilePicture(true)}
            ></img>
            <p className={styles.viewsName}>{viewsName}</p>
            {!loggedUser || !isFriend ? (
              receivedFriendRequest ? (
                <button
                  className={styles.follow}
                  onClick={handleAcceptFriendRequest}
                >
                  Accept
                </button>
              ) : sentFriendRequest ? (
                <div>Panding</div>
              ) : (
                <button
                  type="button"
                  className={styles.follow}
                  onClick={handleClickFollowFriend}
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
            <p>{friends.length} Following</p>
          </div>
          <div className={styles.content}>
            {isFriend ? (
              <AddPost
                picture={user!.picture}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setContent(e.target.value)
                }
                handleClickPicture={handleClickPicture}
                handleClickVideo={handleClickVideo}
                handleClickPost={handleClickPost}
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
                  addLike={(e: React.MouseEvent) => addLike(e, post._id)}
                  deleteLike={(e: React.MouseEvent) => deleteLike(e, post._id)}
                  openLikes={() => openLikes(post)}
                  openComments={() => openComments(post)}
                  handleClick={() => {
                    if (_id !== user!._id) {
                      window.scrollTo(0, 0);
                    } else {
                      router.push(`/views/${_id}`);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.UserData}></div>
        <div className={styles.right}></div>
      </div>
      {profilePicture ? (
        <ModalProfilePicture
          picture={picture}
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
          handleSubmit={async () =>
            await handleSubmitComment(user?._id, postId, contentComment)
          }
          handleSubmitCommentOfComment={(id, postId) =>
            handleSubmitCommentOfComment(id, postId)
          }
          commentChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCommentOfCommentContent(e.target.value)
          }
          setResult={(result) => {
            const newPosts: any = allPosts.map((el: PostsType) =>
              el._id === result._id ? result : el
            );
            setOpenCommentsPressed(result);
            setAllPosts(newPosts);
          }}
          openLikeModal={(like) => {
            openLikes(like);
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ProfileChecker;
