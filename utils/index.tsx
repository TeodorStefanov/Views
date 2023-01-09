import mongoose from "mongoose";
const { DATABASE_URL } = process.env;
console.log(DATABASE_URL)
const Connect = async () => await mongoose.connect(process.env.DATABASE_URL as string);

export default Connect;
