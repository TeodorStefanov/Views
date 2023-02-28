import React from "react";
import { UserData } from "../app/views/[id]/profileChecker";

interface userContextInterface {
  loggedIn: boolean;
  user: UserData | null;
  logIn: (user: UserData) => void;
  logOut: () => void;
  notifications: number;
  setNotifications: React.Dispatch<React.SetStateAction<number>>;
}
const UserContext = React.createContext<userContextInterface>({
  loggedIn: false,
  user: null,
  logIn: () => {},
  logOut: () => {},
  notifications: 0,
  setNotifications: () => 0,
});
export default UserContext;
