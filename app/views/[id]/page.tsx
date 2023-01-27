import User from "../../../models/user";
import Connect from "../../../utils/mongoDBMongooseConnection";
import ProfileChecker from "./profileChecker";
export const revalidate = 0;
async function getUser(id: string) {
  try {
    await Connect();
    const user = await User.findById(id).lean();

    return JSON.parse(JSON.stringify(user));
  } catch (err) {
    return null;
  }
}
interface user {
  _id: string;
  backgroundPicture: string;
  picture: string;
  viewsName: string;
  friends: [];
  posts: {
    content: string;
    imageUrl: string;
    videoUrl: string;
    createdAt: string;
  }[];
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
