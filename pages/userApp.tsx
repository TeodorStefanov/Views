import React, { useEffect, useState } from "react";
import UserContext from "../context";
import jwt from "jsonwebtoken";
import User from "../models/user";
import type { InferGetServerSidePropsType, NextPage } from "next";
function getCookie(name: string): string | null {
  const cookieValue = document.cookie.match("\\b" + name + "=([^;]*)\\b");
  return cookieValue ? cookieValue[1] : null;
}
type Props = {
  children: JSX.Element;
  result?: object | null;
};

const UserApp = (props: Props) => {
  console.log(props);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<object | null>(null);
  const logIn = (user: object): void => {
    setLoggedIn(true);
    setUser(user);
  };
  const getResult = (): void => {
    const result = props.result;
    if (result) {
      setLoggedIn(true);
    }
  };
  const logOut = (): void => {
    document.cookie = "aid= ; expires = Thu, 1 Jan 1970 00:00:01 GMT;path=/";
    setLoggedIn(false);
    setUser(null);
  };
  useEffect((): void => {
    getResult();
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

export async function getServerSideProps() {
  const token = getCookie("token");
  console.log(1);
  if (!token) {
    return {
      props: {
        result: null,
      },
    };
  }
  const decoded = jwt.verify(token, process.env.PRIVATE_KEY as string);
  if (!decoded) {
    return {
      props: {
        result: null,
      },
    };
  }
  return {
    props: {
      result: 1,
    },
  };
  console.log(decoded);
  //const user = await User.findOne({ decoded });
}
