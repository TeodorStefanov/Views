"use client";
import React, { useContext, useEffect, useState, useTransition } from "react";
import UserContext from "../../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./id.module.css";
import { useRouter } from "next/navigation";
import Post from "../../../components/post";
import AddPost from "../../../components/addPost";
import ModalProfilePicture from "../../../components/modalProfilePicture";
export type posts = {
  _id: string;
  content: string;
  imageUrl: string;
  videoUrl: string;
  createdAt: string;
  likes: Array<string>;
  comments: Array<string>;
};
export interface user {
  id: string;
  backgroundPicture: string;
  picture: string;
  viewsName: string;
  friends: [];
  posts: posts[];
}

const ProfileChecker = ({
  id,
  backgroundPicture,
  picture,
  viewsName,
  friends,
  posts,
}: user) => {
  const context = useContext(UserContext);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<boolean>(false);
  const { user } = context;
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPending, startTransition] = useTransition();
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
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?._id,
        content,
        imageUrl,
        videoUrl,
      }),
    });
    if (promise.status === 200) {
      startTransition(() => {
        router.refresh();
      });
    }
    const result = await promise.json();
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
      startTransition(() => {
        router.refresh();
      });
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
      startTransition(() => {
        router.refresh();
      });
    }
  };
  useEffect(() => {
    if (user?._id === id) {
      setLoggedUser(true);
    }
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
            {!loggedUser ? (
              <button type="button" className={styles.follow}>
                Follow
              </button>
            ) : (
              ""
            )}
          </div>
          <div className={styles.middleDescription}>
            <div>Description</div>
            <p>{friends.length} Following</p>
          </div>
          <div className={styles.content}>
            {loggedUser ? (
              <AddPost
                picture={user!.picture}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setContent(e.target.value)
                }
                handleClickPicture={handleClickPicture}
                handleClickVideo={handleClickVideo}
                handleClickPost={handleClickPost}
              />
            ) : (
              ""
            )}
            {posts.map((post, index) => {
              let liked = false;
              const dateNow = new Date().getTime();
              const postDate = new Date(post.createdAt).getTime();
              const differenceInHours = Number(
                ((dateNow - postDate) / 36e5).toFixed(0)
              );
              let postTime = `${differenceInHours} h`;
              if (differenceInHours === 0) {
                const minutes =
                  new Date().getMinutes() -
                  new Date(post.createdAt).getMinutes();
                postTime = `${minutes} m`;
                if (minutes === 0) {
                  postTime = "Just now";
                }
              }
              if (differenceInHours > 24) {
                postTime = `${new Date(
                  new Date().getTime() - differenceInHours * 60 * 60 * 1000
                ).toLocaleDateString("en-GB")}`;
              }
              post.likes.map((el) => {
                if (el === user?._id) {
                  liked = true;
                }
              });
              return (
                <Post
                  key={index}
                  post={post}
                  picture={picture}
                  viewsName={viewsName}
                  postTime={postTime}
                  liked={liked}
                  addLike={(e: React.MouseEvent) => addLike(e, post._id)}
                  deleteLike={(e: React.MouseEvent) => deleteLike(e, post._id)}
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
    </div>
  );
};

export default ProfileChecker;
