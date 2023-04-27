import React from "react";
import io, { Socket } from "socket.io-client";
fetch("/api/socket");
export const socket = io();
socket.on("connect", () => {
  console.log("connected")
});
export const SocketContext = React.createContext<undefined | Socket>(undefined);
