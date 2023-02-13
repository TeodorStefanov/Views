import { UserData } from "../app/views/[id]/profileChecker";

export function traverseComments(
  comment:
    | {
        user: UserData;
        content: string;
        createdAt: Date;
        comments: {
          user: UserData;
          content: string;
          createdAt: Date;
          comments: [];
        }[];
      }[]
    | []
): {
  user: UserData;
  content: string;
  createdAt: Date;
  comments: { user: UserData; content: string; createdAt: Date }[];
}[] {
  let result = [];
  for (let i = 0; i < comment.length; i++) {
    if (comment[i].comments.length > 0) {
      result.push(...traverseComments(comment[i].comments));
    } else {
      result.push(comment[i]);
    }
  }

  return result;
}
