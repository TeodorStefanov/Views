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

const Header = () => {
  const [notifications, setNotifications] = useState<Number>(0);
  const [notificationMenu, setNotificationMenu] = useState<boolean>(false);
  const context = useContext(UserContext);
  const { loggedIn, user, logIn, logOut } = context;
  const [notificationPressed, setNotificationPressed] = useState<
    Notification[] | [] | undefined
  >(user?.notifications);
  const router = useRouter();
  const notificationMenuRef = useRef(null);
  const handleClick = async () => {
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
    friendId: string,
    notificationId: string
  ) => {
    const promise = await fetch(
      "http://localhost:3000/api/acceptFriendRequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?._id,
          idFriend: friendId,
          notificationId: notificationId,
        }),
      }
    );
    if (promise.status === 200) {
      const result = await promise.json();
      setNotificationPressed(result.notifications);
      logIn(result);
    }
  };
  const handleRemoveRequest = async (
    friendId: string,
    notificationId: string
  ) => {
    console.log(friendId);
    const promise = await fetch(
      "http://localhost:3000/api/removeFriendRequest",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?._id, friendId, notificationId }),
      }
    );
    if (promise.status === 200) {
      const result: UserData = await promise.json();
      setNotificationPressed(result.notifications);
      logIn(result);
    }
  };
  useEffect(() => {
    if (user) {
      const notCheckedNotifications = user.notifications!.filter(
        (el) => !el.checked
      );
      setNotifications(notCheckedNotifications.length);
      const notPressedNotifications = user.notifications!.filter(
        (el) => !el.pressed
      );
      window.onclick = (event: any) => {
        if (!event.target?.contains(notificationMenuRef.current)) {
          setNotificationMenu(false);
        }
      };
    }
  }, []);
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
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
            />
            <div className={styles.bell} onClick={handleClick}>
              <FontAwesomeIcon className={styles.bellMark} icon={faBell} />
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
          {notificationPressed?.map((el: Notification, index) => {
            const postDate = calculateDateOrTime(el.createdAt);
            return (
              <div
                className={styles.notification}
                key={index}
                onClick={() => router.push(`/views/${el.sentBy._id}`)}
              >
                <img
                  src={el.sentBy.picture}
                  className={styles.notificationPicture}
                />
                <div className={styles.notificationTop}>
                  <div className={styles.notificationViewsName}>
                    {el.sentBy.viewsName}
                  </div>
                  <div>{el.content}</div>
                  <div className={styles.date}>{postDate}</div>
                  {el.content === "Friend request" ? (
                    <div className={styles.friendRequestButtons}>
                      <button
                        className={styles.friendRequestButton}
                        onClick={(event) =>
                          handleAcceptRequest(el.sentBy._id, el._id)
                        }
                      >
                        Accept
                      </button>
                      <button
                        className={styles.friendRequestButton}
                        onClick={(event) =>
                          handleRemoveRequest(el.sentBy._id, el._id)
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
