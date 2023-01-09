import React from "react";
interface userContextInterface {
  loggedIn: boolean;
  user: null | object;
  logIn: (user: object) => void;
  logOut: (use: object) => void;
}
const UserContext = React.createContext<userContextInterface>({
  loggedIn: false,
  user: null,
  logIn: () => {},
  logOut: () => {},
});
export default UserContext;
