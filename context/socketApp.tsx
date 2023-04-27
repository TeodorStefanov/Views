"use client";
import React, { useEffect, useState } from "react";
import { SocketContext } from "./socketContext";
import io from "socket.io-client";

type Props = {
  children: React.ReactNode;
};

const SocketApp = ({ children }: Props): JSX.Element | null => {
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    const fetchSocketUrl = async () => {
      try {
        await fetch("/api/socket");
        const socket = io();

        socket.on("connect", () => {
          console.log("connected");
          setIsSocketReady(true);
        });

        socket.on("disconnect", () => {
          console.log("disconnected");
          setIsSocketReady(false);
        });

        return () => {
          socket.disconnect();
        };
      } catch (error) {
        console.error("Error fetching socket URL:", error);
      }
    };

    fetchSocketUrl();
  }, []);

  if (!isSocketReady) {
    return null;
  }

  return (
    <SocketContext.Provider value={io()}>{children}</SocketContext.Provider>
  );
};

export default SocketApp
