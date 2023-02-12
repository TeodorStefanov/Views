import React from "react";
import { UserData } from "../app/views/[id]/profileChecker";

interface userContextInterface {
  loggedIn: boolean;
  user: UserData | null;
  logIn: (user: UserData) => void;
  logOut: () => void;
}
const UserContext = React.createContext<userContextInterface>({
  loggedIn: false,
  user: null,
  logIn: () => {},
  logOut: () => {},
});
export default UserContext;
