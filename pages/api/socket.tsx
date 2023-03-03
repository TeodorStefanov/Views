import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

import Posts from "../../models/posts";
import Connect from "../../utils/mongoDBMongooseConnection";
import User from "../../models/user";
import Comments from "../../models/comments";
import { PostsType } from "../../app/views/[id]/profileChecker";
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
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.socket.setMaxListeners(100);
  } else {
    console.log("Server is initiializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
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
              socket.broadcast.emit("allPosts", posts);
            }
          } catch (err) {
            console.log(err);
          }
        }
      );
      socket.on("addLike", async (postId, userId, method) => {
        try {
          if (method === "add") {
            const post = await addLikeToPost(postId, userId);
            if (post) {
              socket.broadcast.emit("addLike", post);
            }
          } else {
            const post = await deleteLikeToPost(postId, userId);
            if (post) {
              socket.broadcast.emit("addLike", post);
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
          postId: string
        ) => {
          if (!postId) {
            const post = await createCommentUpdatePost(
              userId,
              id,
              contentComment
            );
            if (post) {
              socket.broadcast.emit("allComments", post);
            }
          } else {
            const post = await addCommentOfComment(
              userId,
              id,
              contentComment,
              postId
            );
            if (post) {
              socket.broadcast.emit("allComments", post);
            }
          }
        }
      );
      socket.on("sentFriendRequest", async (userId, friendId) => {
        const user = await createFriendRequestNotification(userId, friendId)
        if (user) {
          socket.broadcast.emit("sentFriendRequest", user);
        }
      });
    });
  }
  res.end();
}
