import React from "react";
import { Socket } from "socket.io-client";

export const SocketContext = React.createContext<undefined | Socket>(undefined);
