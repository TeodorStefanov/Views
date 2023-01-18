import React, { useEffect, useState } from "react";
import UserContext from "./context";
import User from "./models/user";
type Props = {
  children: JSX.Element;
};
type User = {
  _id: string;
  username: string;
  password: string;
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
  const getToken = async () => {
    const promise = await fetch("/api/getToken");
    if (promise.status === 200) {
      const result = await promise.json();
      logIn(result);
    }
  };
  const logOut = async () => {
    const promise = await fetch("/api/deleteToken");
    if (promise.status === 200) {
      setLoggedIn(false);
      setUser(null);
      setError(true);
    } else {
      setError(true);
    }
  };
  useEffect((): void => {
    getToken();
    setError(true);
  }, []);
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
