import User from "../../../models/user";
import Connect from "../../../utils/mongoDBMongooseConnection";
import ProfileChecker from "./profileChecker";

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
  friends: [];
}
export default async function Profile({ params }: any) {
  const id = params.id;
  const userFind: user = await getUser(id);
  if (!userFind) {
    throw new Error('User not found!')
  }
  return (
    <ProfileChecker
      id={userFind._id}
      backgroundPicture={userFind.backgroundPicture}
      picture={userFind.picture}
      friends={userFind.friends}
    />
  );
}
