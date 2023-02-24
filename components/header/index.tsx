"use client";
import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import styles from "./index.module.css";
import UserContext from "../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Notification } from "../../app/views/[id]/profileChecker";
const Header = () => {
  const [notifications, setNotifications] = useState<Number>(0);
  const [notificationMenu, setNotificationMenu] = useState<boolean>(false);
  const context = useContext(UserContext);
  const { loggedIn, user, logOut } = context;
  const [notificationPressed, setNotificationPressed] = useState<
    Notification[] | [] | undefined
  >(user?.notifications);
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
        setNotificationMenu(true);
        setNotifications(0);
      }
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
        <div>
          {notificationPressed?.map((el) => {
            return <div></div>;
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default Header;
