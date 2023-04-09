"use client";
import Link from "next/link";
import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import UserContext from "../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Notification, UserData } from "../../app/views/[id]/profileChecker";
import { calculateDateOrTime } from "../../utils/calculateDateOrTime";
import { useRouter } from "next/navigation";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
let socket: undefined | Socket;
const Header = () => {
  const [notificationMenu, setNotificationMenu] = useState<boolean>(false);
  const context = useContext(UserContext);
  const { loggedIn, user, logIn, logOut, notifications, setNotifications } =
    context;

  const router = useRouter();
  const notificationMenuRef = useRef(null);
  const handleClick = async () => {
    console.log(1)
    if (user) {
      const promise = await fetch(
        "http://localhost:3000/api/userNotificationsChecked",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );
      if (promise.status === 200) {
        if (!notificationMenu) {
          setNotificationMenu(true);
        }
        setNotifications(0);
      }
    }
  };
  const handleAcceptRequest = async (
    event: React.MouseEvent<HTMLButtonElement>,
    friendId: string,
    notificationId: string
  ) => {
    event.stopPropagation();
    const userId = user?._id;
    if (socket !== undefined) {
      socket.emit("acceptFriendRequest", userId, friendId, notificationId);
    }
  };

  const handleRemoveRequest = async (
    event: React.MouseEvent<HTMLButtonElement>,
    friendId: string,
    notificationId: string
  ) => {
    event.stopPropagation();
    const userId = user?._id;
    if (socket !== undefined) {
      socket.emit("removeFriendRequest", userId, friendId, notificationId);
    }
  };
  const handleClickNotification = async (
    id: string,
    content: string,
    sentById: string
  ) => {
    if (socket !== undefined) {
      socket.emit("userNotificationPressed", user?._id, id);
    }
    if (content === "Friend request" || content === "Friend request accepted") {
      router.push(`/views/${sentById}`);
    } else if (content === "posted on your wall") {
      router.push(`/views/${user?._id}`);
    }
  };
  const socketInitializer = async () => {
    socket = io();
    socket.emit("login", user?._id);
    socket.on("friendNotification", (user) => {
      logIn(user.friendUser);
    });
    socket.on("acceptFriendRequest", (user) => {
      logIn(user);
    });
    socket.on("acceptFriendNotification", (user) => {
      logIn(user);
    });
    socket.on("removeFriendRequest", (user) => {
      logIn(user);
      setNotificationMenu(false);
    });
    socket.on("removeFriendNotification", (user) => {
      logIn(user);
    });
    socket.on("userNotificationPressed", (user) => {
      logIn(user);
    });
  };
  useEffect(() => {
    window.onclick = (event: any) => {
      if (!event.target?.contains(notificationMenuRef.current)) {
        setNotificationMenu(false);
      }
    };
    socketInitializer();
  }, []);
  return (
    <div className={styles.container}>
      <Link href="/views" className={styles.logo}>
        Views
      </Link>

      <div className={styles.windows}>
        {!loggedIn ? (
          <div className={styles.windowLoggedNot}>
            <Link
              href={{ pathname: "/", query: { message: "login" } }}
              shallow
              className={styles.windowLogin}
            >
              Log In
            </Link>
            <Link
              href={{ pathname: "/", query: { message: "registration" } }}
              shallow
              className={styles.windowRegister}
            >
              Registration
            </Link>
          </div>
        ) : (
          <div className={styles.windowLogged}>
            <img
              src={
                user?.picture ||
                "https://res.cloudinary.com/daqcaszkf/image/upload/v1673947682/blank-profile-picture-973460__340_v3thun.webp"
              }
              className={styles.picture}
              alt=""
              onClick={(e) => {
                e.preventDefault();
                router.push(`/views/${user?._id}`);
              }}
            />
            <div
              className={`${styles.bell} ${
                notificationMenu ? styles.bellPressed : ""
              }`}
              onClick={handleClick}
            >
              <FontAwesomeIcon
                className={`${styles.bellMark} ${
                  notificationMenu ? styles.bellMarkPressed : ""
                }`}
                icon={faBell}
              />
              {notifications > 0 ? (
                <div className={styles.notificationsNumber}>
                  {notifications.toFixed(0)}
                </div>
              ) : (
                ""
              )}
            </div>
            <Link href="/" className={styles.windowLogOut} onClick={logOut}>
              Log Out
            </Link>
          </div>
        )}
      </div>
      {notificationMenu ? (
        <div
          className={styles.notificationsContainer}
          ref={notificationMenuRef}
        >
          {user?.notifications?.map((el: Notification, index) => {
            const postDate = calculateDateOrTime(el.createdAt);
            return (
              <div
                className={`${styles.notification} ${
                  !el.pressed ? styles.notificationNotPressed : ""
                }`}
                key={index}
                onClick={() =>
                  handleClickNotification(el._id, el.content, el.sentBy._id)
                }
              >
                <img
                  src={el.sentBy.picture}
                  className={styles.notificationPicture}
                />
                <div className={styles.notificationTop}>
                  <div className={styles.viewsNameContent}>
                    <b>{el.sentBy.viewsName}</b> {el.content}
                  </div>
                  <div className={styles.date}>{postDate}</div>
                  {el.content === "Friend request" ? (
                    <div className={styles.friendRequestButtons}>
                      <button
                        className={styles.friendRequestButton}
                        onClick={(e) =>
                          handleAcceptRequest(e, el.sentBy._id, el._id)
                        }
                      >
                        Accept
                      </button>
                      <button
                        className={styles.friendRequestButton}
                        onClick={(e) =>
                          handleRemoveRequest(e, el.sentBy._id, el._id)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default Header;
