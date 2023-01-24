"use client";
import React from "react";
type User = {
  _id: string;
  username: string;
  email: string;
  picture: string;
  viewsName: string;
  friends: Array<string>;
};
interface userContextInterface {
  loggedIn: boolean;
  user: User | null;
  logIn: (user: User) => void;
  logOut: () => void;
}
const UserContext = React.createContext<userContextInterface>({
  loggedIn: false,
  user: null,
  logIn: () => {},
  logOut: () => {},
});
export default UserContext;
