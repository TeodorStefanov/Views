import {
    addLikeToComment,
    deleteLikeToComment,
  } from "../../controllers/comments";
  
  export const likeToComment = async (
    commentId: string,
    userId: string,
    postId: string,
    id: string,
    method: string
  ) => {
    if (method === "add") {
      const posts = await addLikeToComment(commentId, userId, postId, id);
      if (posts) {
        return posts;
      }
    } else {
      const posts = await deleteLikeToComment(commentId, userId, postId, id);
      if (posts) {
        return posts;
      }
    }
  };