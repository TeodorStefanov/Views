import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";
import {
  createFriendRequestNotification,
  userNotificationPressed,
} from "../../controllers/notifications";
import { likes } from "../../utils/socket/likes";
import { comments } from "../../utils/socket/comments";
import { newCart } from "../../controllers/posts";
import {
  acceptFriendRequest,
  removeFriendRequest,
  userChangeBackgroundPicture,
  userChangeProfilePicture,
} from "../../controllers/user";
import { likeToComment } from "../../utils/socket/likeToComment";

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
    res.socket.setMaxListeners(100);
  } else {
    console.log("Server is initiializing");

    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      console.log("server is connected");
      socket.on("main", () => {
        socket.join("main");
      });
      socket.on("login", (id: string) => {
        socket.join(`${id}-room`);
      });
      socket.on("joinRoom", (id: string) => {
        socket.join(id);
      });
      socket.on(
        "allPosts",
        async (
          userId: string,
          content: string,
          imageUrl: string,
          videoUrl: string,
          createdBy: string
        ) => {
          const user = await newCart(
            userId,
            content,
            imageUrl,
            videoUrl,
            createdBy
          );
          io.in(userId).emit("allPosts", user?.postsUser);
          io.in("main").emit("posts", user?.posts);
        }
      );
      socket.on(
        "addLike",
        async (
          postId: string,
          userId: string,
          method: string,
          roomId: string
        ) => {
          const posts = await likes(postId, userId, method, roomId);
          io.in(roomId).emit("addLike", posts?.postsUser);
          io.in("main").emit("likes", posts?.posts);
        }
      );
      socket.on(
        "allComments",
        async (
          userId: string,
          id: string,
          contentComment: string,
          roomId: string,
          postId: string
        ) => {
          io.in([roomId, "main"]).emit(
            "allComments",
            await comments(userId, id, contentComment, roomId, postId)
          );
        }
      );
      socket.on(
        "sentFriendRequest",
        async (userId: string, friendId: string) => {
          const user = await createFriendRequestNotification(userId, friendId);
          io.in(`${userId}-room`).emit("sentFriendRequest", user?.user);
          io.in(`${friendId}-room`).emit("friendNotification", {
            friendUser: user?.friendUser,
            notificationId: user?.notificationId,
          });
        }
      );
      socket.on(
        "acceptFriendRequest",
        async (userId: string, notificationId: string, friendId: string) => {
          const user = await acceptFriendRequest(
            userId,
            friendId,
            notificationId
          );
          io.in(`${userId}-room`).emit("acceptFriendRequest", user?.user);
          io.in(`${friendId}-room`).emit(
            "acceptFriendNotification",
            user?.friendUser
          );
        }
      );
      socket.on(
        "removeFriendRequest",
        async (userId: string, notificationId: string, friendId: string) => {
          const user = await removeFriendRequest(
            userId,
            friendId,
            notificationId
          );
          io.in(`${userId}-room`).emit("removeFriendRequest", user?.user);
          io.in(`${friendId}-room`).emit(
            "removeFriendNotification",
            user?.friendUser
          );
        }
      );
      socket.on(
        "likeToComment",
        async (
          commentId: string,
          userId: string,
          postId: string,
          id: string,
          method: string
        ) => {
          io.in([id, "main"]).emit(
            "likeToComment",
            await likeToComment(commentId, userId, postId, id, method)
          );
        }
      );
      socket.on(
        "userNotificationPressed",
        async (userId: string, id: string) => {
          io.in(`${userId}-room`).emit(
            "userNotificationPressed",
            await userNotificationPressed(userId, id)
          );
        }
      );
      socket.on(
        "changeBackgroundPicture",
        async (userId: string, picture: string) => {
          io.in(`${userId}-room`).emit(
            "changeBackgroundPicture",
            await userChangeBackgroundPicture(userId, picture)
          );
        }
      )
      socket.on(
        "changeProfilePicture",
        async (userId: string, picture: string) => {
          io.in(`${userId}-room`).emit(
            "changeProfilePicture",
            await userChangeProfilePicture(userId, picture)
          );
        }
      )
    });
  }
  res.end();
}
