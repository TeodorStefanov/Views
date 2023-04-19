import User from "../../../models/user";
import Posts from "../../../models/posts";
import Comments from "../../../models/comments";
import Connect from "../../../utils/mongoDBMongooseConnection";
import ProfileChecker from "./profileChecker";
import Notification from "../../../models/notifications";
import { UserData } from "../../../utils/types";
export const revalidate = 0;
async function getUser(id: string) {
  try {
    await Connect();
    const user = await User.findById(id)
      .populate([
        {
          path: "posts",
          model: Posts,
          populate: [
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
          ],
        },
        {
          path: "notifications",
          model: Notification,
          populate: { path: "sentBy", model: User },
        },
        { path: "friends", model: User },
        { path: "friendRequests", model: User },
      ])
      .lean();
    return JSON.parse(JSON.stringify(user));
  } catch (err) {
    console.log(err);
    return null;
  }
}
export default async function Profile({ params }: any) {
  const id = params.id;
  const userFind: UserData = await getUser(id);
  if (!userFind) {
    throw new Error("User not found!");
  }

  return (
    <ProfileChecker
      _id={userFind._id}
      backgroundPicture={userFind.backgroundPicture}
      picture={userFind.picture}
      viewsName={userFind.viewsName}
      friends={userFind.friends}
      posts={userFind.posts.reverse()}
    />
  );
}
