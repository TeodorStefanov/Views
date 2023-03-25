import { newCart } from "../../controllers/posts";

export const posts = async (
  userId: string,
  content: string,
  imageUrl: string,
  videoUrl: string,
  createdBy: string
) => {
  const posts = await newCart(userId, content, imageUrl, videoUrl, createdBy);
  if (posts) {
    return posts;
  }
};
