import mongoose from "mongoose";
const Connect = async () =>
  await mongoose.connect(process.env.DATABASE_URL as string);

export default Connect;
