import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

import {
  addCommentOfComment,
  createCommentUpdatePost,
} from "../../controllers/comments";
import {
  addLikeToPost,
  deleteLikeToPost,
  newCart,
} from "../../controllers/posts";
import { createFriendRequestNotification } from "../../controllers/notifications";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}
let serverId: string = "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    res.socket.setMaxListeners(20);
  } else {
    console.log("Server is initiializing");

    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      console.log("server is connected");
      socket.on("joinRoom", (id) => {
        socket.join(id);
      });
      socket.on(
        "allPosts",
        async (userId, content, imageUrl, videoUrl, createdBy) => {
          try {
            const posts = await newCart(
              userId,
              content,
              imageUrl,
              videoUrl,
              createdBy
            );

            if (posts) {
              io.in(userId).emit("allPosts", posts);
            }
          } catch (err) {
            console.log(err);
          }
        }
      );
      socket.on("addLike", async (postId, userId, method, roomId) => {
        try {
          if (method === "add") {
            const post = await addLikeToPost(postId, userId);
            if (post) {
              io.in(roomId).emit("addLike", post)
            }
          } else {
            const post = await deleteLikeToPost(postId, userId);
            if (post) {
              io.in(roomId).emit("addLike", post);
            }
          }
        } catch (err) {
          console.log(err);
        }
      });
      socket.on(
        "allComments",
        async (
          userId: string,
          id: string,
          contentComment: string,
          roomId: string,
          postId: string
        ) => {
          if (!postId) {
            const post = await createCommentUpdatePost(
              userId,
              id,
              contentComment
            );
            if (post) {
              io.in(roomId).emit("allComments", post);
            }
          } else {
            const post = await addCommentOfComment(
              userId,
              id,
              contentComment,
              postId
            );
            if (post) {
              io.in(roomId).emit("allComments", post);
            }
          }
        }
      );
      socket.on("sentFriendRequest", async (userId, friendId) => {
        const user = await createFriendRequestNotification(userId, friendId);
        if (user) {
          io.in(friendId).emit("sentFriendRequest", user);
        }
      });
    });
  }
  res.end();
}
