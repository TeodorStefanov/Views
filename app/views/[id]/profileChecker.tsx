"use client";
import React, { FC, useContext, useEffect, useState } from "react";
import UserContext from "../../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./id.module.css";
interface user {
  id: string;
  backgroundPicture: string;
  picture: string;
  friends: [];
}
interface IFormInputs {
  text?: string;
  picture?: string;
  video?: string;
}
interface Window {
  cloudinary: string;
}

const ProfileChecker = ({ id, backgroundPicture, picture, friends }: user) => {
  const context = useContext(UserContext);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<boolean>(false);
  const { user } = context;
  const [write, setWrite] = useState<string>("");
  const [addPicture, setAddPicture] = useState<string>("");
  const handleClickPicture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "daqcaszkf",
        uploadPreset: "softuni",
      },
      (error:any, result:any) => {
        if (error) {
          console.log("Error:", error);
        }
        if (result.event === "success") {
          setAddPicture(result.info.url);
        }
      }
    );
    widget.open();
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
            {!loggedUser ? (
              <button type="button" className={styles.follow}>
                Follow
              </button>
            ) : (
              ""
            )}
          </div>
          <div className={styles.middleDescription}>
            <b className={styles.viewsName}>{user?.viewsName}</b>
            <p>Description</p>
            <div>{friends.length} Following</div>
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
                    onChange={(e) => setWrite(e.target.value)}
                  />
                </label>
                <div className={styles.addSomethingButtons}>
                  <button
                    className={styles.addSomethingButton}
                    onClick={handleClickPicture}
                  >
                    Add Picture
                  </button>
                  <button className={styles.addSomethingButton}>
                    Add Video
                  </button>
                  <button className={styles.addSomethingButtonPost}>
                    Post
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
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
