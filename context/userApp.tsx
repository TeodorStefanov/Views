"use client";
import React, { useEffect, useState } from "react";
import UserContext from "./context";
import User from "../models/user";

type Props = {
  children: JSX.Element;
  token?: User | null;
};
type User = {
  _id: string;
  username: string;
  email: string;
  picture: string;
  viewsName: string;
  friends: Array<string>;
};

const UserApp = (props: Props): JSX.Element | null => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<boolean>(false);
  const logIn = (user: User): void => {
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
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
export default UserApp;