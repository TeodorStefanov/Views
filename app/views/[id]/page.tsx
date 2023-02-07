import User from "../../../models/user";
import Posts from "../../../models/posts";
import Connect from "../../../utils/mongoDBMongooseConnection";
import ProfileChecker, { posts } from "./profileChecker";
export const revalidate = 0;
async function getUser(id: string) {
  try {
    await Connect();
    const user = await User.findById(id)
      .populate({ path: "posts", model: Posts })
      .lean();
    return JSON.parse(JSON.stringify(user));
  } catch (err) {
    console.log(err);
    return null;
  }
}
interface user {
  _id: string;
  backgroundPicture: string;
  picture: string;
  viewsName: string;
  friends: [];
  posts: posts[];
}
export default async function Profile({ params }: any) {
  const id = params.id; 
  const userFind: user = await getUser(id);
  if (!userFind) {
    throw new Error("User not found!");
  }

  return (
    <ProfileChecker
      id={userFind._id}
      backgroundPicture={userFind.backgroundPicture}
      picture={userFind.picture}
      viewsName={userFind.viewsName}
      friends={userFind.friends}
      posts={userFind.posts.reverse()}
    />
  );
}
