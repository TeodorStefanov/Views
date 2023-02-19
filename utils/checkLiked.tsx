import { Comment, PostsType } from "../app/views/[id]/profileChecker";

export function likeExists(obj: Comment | PostsType, userId: string) {
  let liked = false;
  obj.likes.map((like) => {
    if (like._id === userId) {
      liked = true;
    }
  });
  return liked;
}
