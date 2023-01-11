import jwt from "jsonwebtoken";
import config from "../../../next.config";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
const generateToken = (data: any) => {
  const token = jwt.sign(data, config.privetKey, { expiresIn: "1h" });
  return token;
};

module.exports = () => {
  return mongoose.connect(config.dbURL);
};
