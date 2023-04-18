export type PostsType = {
  _id: string;
  content: string;
  imageUrl: string;
  videoUrl: string;
  createdAt: Date;
  createdBy: UserData;
  createdTo: UserData;
  likes: Array<UserData>;
  comments: Array<Comment> | [];
};
export interface Comment {
  _id: string;
  user: UserData;
  content: string;
  createdAt: Date;
  likes: Array<UserData> | [];
  comments: Array<Comment> | [];
}
export interface UserData {
  _id: string;
  backgroundPicture: string;
  picture: string;
  viewsName: string;
  friends: UserData[] | [];
  friendRequests?: UserData[] | [];
  posts: PostsType[];
  notifications?: Notification[] | [];
}
export type Notification = {
  _id: string;
  sentBy: UserData;
  setnTo: UserData;
  content: string;
  checked: boolean;
  pressed: boolean;
  createdAt: Date;
};
export type Posts = {
  post: PostsType;
  postsUser: PostsType[];
  posts: PostsType[];
};
export type FriendNotification = {
  friendUser: UserData;
  notificationId: string;
}
export type PostType = {
  posts: PostsType[]
}
