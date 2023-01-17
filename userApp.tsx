import React, { useEffect, useState } from "react";
import UserContext from "./context";
type Props = {
  children: JSX.Element;
};
type User = {
  username: string;
  password: string;
  email: string;
  picture: string;
  viewsName: string
};
const UserApp = (props: Props) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const logIn = (user: User): void => {
    setLoggedIn(true);
    setUser(user);
  };
  const getToken = async () => {
    const promise = await fetch("/api/getToken");
    if (promise.status === 200) {
      const result = await promise.json();
      console.log(result);
      logIn(result);
    }
  };
  const logOut = async () => {
    const promise = await fetch("/api/deleteToken");
    if (promise.status === 200) {
      setLoggedIn(false);
      setUser(null);
    }
  };
  useEffect((): void => {
    getToken();
  }, []);
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
