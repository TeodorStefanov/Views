import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const Connect = async () => await mongoose.connect(process.env.DATABASE_URL!);

export default Connect;
