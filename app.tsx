import React, { useEffect, useState } from "react";
import UserContext from "./context";
function getCookie(name: string): string | null {
  const cookieValue = document.cookie.match("\\b" + name + "=([^;]*)\\b");
  return cookieValue ? cookieValue[1] : null;
}
type Props = {
  children: JSX.Element;
  result: object | null;
};
const App = (props: Props) => {
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
      logIn(result);
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
export const getServerSideProps = async () => {
  const token = getCookie("aid");
  if (!token) {
    return {
      props: null,
    };
  }
  const res = await fetch("/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  if (res.status === 200) {
    const result = res.json();
    return {
      props: {
        result,
      },
    };
  }
};
export default App;
