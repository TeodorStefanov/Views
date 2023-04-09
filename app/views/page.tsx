import Comments from "../../models/comments";
import Posts from "../../models/posts";
import User from "../../models/user";
import Connect from "../../utils/mongoDBMongooseConnection";
import ViewsPage from "./viewsPage";
import { PostsType } from "./[id]/profileChecker";

export const revalidate = 0;
async function getPosts() {
  try {
    await Connect();
    const posts = await Posts.find().populate([
      { path: "likes", model: User },
      {
        path: "comments",
        model: Comments,
        populate: [
          { path: "user", model: User },
          {
            path: "comments",
            model: Comments,
            populate: [
              { path: "user", model: User },
              { path: "likes", model: User },
              { path: "comments", model: Comments },
            ],
          },
          {
            path: "likes",
            model: User,
          },
        ],
      },
      { path: "createdBy", model: User },
      { path: "createdTo", model: User },
    ])

    return JSON.parse(JSON.stringify(posts));
  } catch (err) {
    console.log(err);
    return null;
  }
}
export default async function MainPage() {
  const posts: PostsType[] = await getPosts();
  if (!posts) {
    throw new Error("User not found!");
  }

  return <ViewsPage posts={posts.reverse()} />;
}
