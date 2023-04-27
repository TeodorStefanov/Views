"use client";
import { SocketContext, socket } from "./socketContext";

type Props = {
  children: JSX.Element;
};
const SocketApp = (props: Props): JSX.Element | null => {
  if (!socket) {
    return null;
  }
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
export default SocketApp;
