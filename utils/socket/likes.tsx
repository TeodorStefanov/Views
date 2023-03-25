import { addLikeToPost, deleteLikeToPost } from "../../controllers/posts";

export const likes = async (
  postId: string,
  userId: string,
  method: string,
  roomId: string
) => {
  if (method === "add") {
    const posts = await addLikeToPost(postId, userId, roomId);
    if (posts) {
      return posts;
    }
  } else {
    const posts = await deleteLikeToPost(postId, userId, roomId);
    if (posts) {
      return posts;
    }
  }
};
