import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
let socket: undefined | Socket;
socket = io();
export const handleClickPost = (
  userId: string,
  createdBy: string,
  content: string,
  imageUrl: string,
  videoUrl: string
) => {
  if (content || imageUrl || videoUrl) {
    if (socket !== undefined) {
      socket.emit("allPosts", userId, content, imageUrl, videoUrl, createdBy);
    }
  }
};
export const addLike = (userId: string, postId: string, id: string) => {
  if (socket !== undefined) {
    socket.emit("addLike", postId, userId, "add", id);
  }
};
export const deleteLike = (userId: string, postId: string, id: string) => {
  if (socket !== undefined) {
    socket.emit("addLike", postId, userId, "delete", id);
  }
};
export const handleSubmitComment = (
  userId: string | undefined,
  id: string,
  contentComment: string,
  _id: string
) => {
  if (contentComment) {
    if (socket !== undefined) {
      socket.emit("allComments", userId, id, contentComment, _id);
    }
  }
};
export const handleSubmitCommentOfComment = async (
  userId: string,
  id: string,
  postId: string,
  commentOfCommentContent: string,
  _id: string
) => {
  if (commentOfCommentContent) {
    if (socket !== undefined) {
      socket.emit(
        "allComments",
        userId,
        id,
        commentOfCommentContent,
        _id,
        postId
      );
    }
  }
};
export const handleClickFollowFriend = async (
  userId: string,
  friendId: string
) => {
  if (socket !== undefined) {
    socket.emit("sentFriendRequest", userId, friendId);
  }
};
export const handleAcceptFriendRequest = async (
  userId: string,
  id: string,
  receivedFriendRequest: string
) => {
  if (socket !== undefined) {
    socket.emit("acceptFriendRequest", userId, id, receivedFriendRequest);
  }
};
export const handleAcceptRequest = async (
  event: React.MouseEvent<HTMLButtonElement>,
  friendId: string,
  notificationId: string,
  userId: string
) => {
  event.stopPropagation();
  if (socket !== undefined) {
    socket.emit("acceptFriendRequest", userId, friendId, notificationId);
  }
};

export const handleRemoveRequest = async (
  event: React.MouseEvent<HTMLButtonElement>,
  friendId: string,
  notificationId: string,
  userId: string
) => {
  event.stopPropagation();
  if (socket !== undefined) {
    socket.emit("removeFriendRequest", userId, friendId, notificationId);
  }
};
export const handleClickNotification = async (
  id: string,
  content: string,
  sentById: string,
  userId: string
) => {
  if (socket !== undefined) {
    socket.emit("userNotificationPressed", userId, id);
  }
}
