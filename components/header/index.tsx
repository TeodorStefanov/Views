"use client";
import Link from "next/link";
import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import UserContext from "../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FriendNotification, Notification, UserData } from "../../utils/types";
import { calculateDateOrTime } from "../../utils/calculateDateOrTime";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  handleAcceptRequest,
  handleRemoveRequest,
  handleClickNotification,
} from "../../utils/socket/socketEmits";
import { SocketContext } from "../../context/socketContext";

const Header = () => {
  const [notificationMenu, setNotificationMenu] = useState<boolean>(false);
  const context = useContext(UserContext);
  const socket = useContext(SocketContext);
  const { loggedIn, user, logIn, logOut, notifications, setNotifications } =
    context;

  const router = useRouter();
  const notificationMenuRef = useRef(null);
  const handleClick = async () => {
    if (user) {
      const promise = await fetch("/api/userNotificationsChecked", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });
      if (promise.status === 200) {
        if (!notificationMenu) {
          setNotificationMenu(true);
        }
        setNotifications(0);
      }
    }
  };
  const socketInitializer = async () => {
    socket?.emit("login", user?._id);
    socket?.on("friendNotification", (user: FriendNotification) => {
      logIn(user.friendUser);
    });
    socket?.on("acceptFriendRequest", (user: UserData) => {
      logIn(user);
    });
    socket?.on("acceptFriendNotification", (user: UserData) => {
      logIn(user);
    });
    socket?.on("removeFriendRequest", (user: UserData) => {
      logIn(user);
      setNotificationMenu(false);
    });
    socket?.on("removeFriendNotification", (user: UserData) => {
      logIn(user);
    });
    socket?.on("userNotificationPressed", (user: UserData) => {
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
  }, [user]);
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
            <Image
              src={
                user?.picture ||
                "https://res.cloudinary.com/daqcaszkf/image/upload/v1673947682/blank-profile-picture-973460__340_v3thun.webp"
              }
              className={styles.picture}
              width={200}
              height={200}
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
            <div
              className={styles.windowLogOut}
              onClick={() => {
                router.push("/");
                logOut();
                if (socket != undefined) {
                  socket.disconnect();
                }
              }}
            >
              Log Out
            </div>
          </div>
        )}
      </div>
      {notificationMenu ? (
        <div
          className={styles.notificationsContainer}
          ref={notificationMenuRef}
        >
          {user?.notifications?.map((el: Notification, index: number) => {
            const postDate = calculateDateOrTime(el.createdAt);
            return (
              <div
                className={`${styles.notification} ${
                  !el.pressed ? styles.notificationNotPressed : ""
                }`}
                key={index}
                onClick={() => {
                  handleClickNotification(user!._id, el._id);
                  if (
                    el.content === "Friend request" ||
                    el.content === "Friend request accepted"
                  ) {
                    router.push(`/views/${el.sentBy._id}`);
                  } else if (el.content === "posted on your wall") {
                    router.push(`/views/${user?._id}`);
                  }
                }}
              >
                <Image
                  src={el.sentBy.picture}
                  className={styles.notificationPicture}
                  width={200}
                  height={200}
                  alt="pic"
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
                          handleAcceptRequest(
                            e,
                            user!._id,
                            el._id,
                            el.sentBy._id
                          )
                        }
                      >
                        Accept
                      </button>
                      <button
                        className={styles.friendRequestButton}
                        onClick={(e) =>
                          handleRemoveRequest(
                            e,
                            user!._id,
                            el._id,
                            el.sentBy._id
                          )
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
