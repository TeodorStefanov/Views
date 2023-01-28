"use client";
import React, { useContext, useEffect, useState, useTransition } from "react";
import UserContext from "../../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./id.module.css";
import { useRouter } from "next/navigation";
interface user {
  id: string;
  backgroundPicture: string;
  picture: string;
  viewsName: string;
  friends: [];
  posts: {
    content: string;
    imageUrl: string;
    videoUrl: string;
    createdAt: string;
  }[];
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
    const promise = await fetch(
      "http://localhost:3000/api/registerUpdateUser",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?._id,
          posts: { content, imageUrl, videoUrl },
        }),
      }
    );
    if (promise.status === 200) {
      startTransition(() => {
        router.refresh();
      });
    }
    const result = await promise.json();
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
              <div className={styles.addSomething}>
                <img
                  src={user?.picture}
                  className={styles.addSomethingPicture}
                ></img>
                <label htmlFor="Add something">
                  <input
                    name="Add something"
                    className={styles.addSomethingField}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </label>
                <div className={styles.addSomethingButtons}>
                  <button
                    className={styles.addSomethingButton}
                    onClick={handleClickPicture}
                  >
                    Add Picture
                  </button>
                  <button
                    className={styles.addSomethingButton}
                    onClick={handleClickVideo}
                  >
                    Add Video
                  </button>
                  <button
                    className={styles.addSomethingButtonPost}
                    onClick={handleClickPost}
                  >
                    Post
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
            {posts.map((post, index) => {
              console.log(posts);
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
                console.log(differenceInHours);
              }
              return (
                <div className={styles.postContainer} key={index}>
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
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.UserData}></div>
        <div className={styles.right}></div>
      </div>
      {profilePicture ? (
        
          <div className={styles.modalContainer}>
            <div className={styles.modalMain}>
              <img src={picture} className={styles.modalPicture} />
            </div>
            <div className={styles.overlay}></div>
            <div
              className={styles.modalOverlayButton}
              onClick={() => setProfilePicture(false)}
            >
              <FontAwesomeIcon className={styles.markButton} icon={faXmark} />
            </div>
          </div>
        
      ) : (
        ""
      )}
    </div>
  );
};

export default ProfileChecker;
