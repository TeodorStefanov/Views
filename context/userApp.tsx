"use client";
import React, { useEffect, useState } from "react";
import UserContext from "./context";
import { UserData } from "../utils/types";

type Props = {
  children: JSX.Element;
  token?: UserData | null;
};

const UserApp = (props: Props): JSX.Element | null => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<number>(0);
  const logIn = (user: UserData): void => {
    const notCheckedNotifications = user.notifications!.filter(
      (el) => !el.checked
    );
    setNotifications(notCheckedNotifications.length);
    setLoggedIn(true);
    setUser(user);
  };
  const logOut = async () => {
    const res = await fetch("/api/deleteToken");
    if (res.status === 200) {
      setLoggedIn(false);
      setUser(null);
      setError(true);
    } else {
      setError(true);
    }
  };
  useEffect((): void => {
    if (props.token) {
      logIn(props.token);
    }

    setError(true);
  }, [props.token]);
  if (!error) {
    return null;
  }
  return (
    <UserContext.Provider
      value={{
        loggedIn,
        user,
        logIn,
        logOut,
        notifications,
        setNotifications,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
export default UserApp;
