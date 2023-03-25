import {
  addCommentOfComment,
  createCommentUpdatePost,
} from "../../controllers/comments";

export const comments = async (
  userId: string,
  id: string,
  contentComment: string,
  roomId: string,
  postId: string
) => {
  if (!postId) {
    const posts = await createCommentUpdatePost(
      userId,
      id,
      contentComment,
      roomId
    );
    if (posts) {
      return posts;
    }
  } else {
    const posts = await addCommentOfComment(
      userId,
      id,
      contentComment,
      roomId,
      postId
    );
    if (posts) {
      return posts;
    }
  }
};
