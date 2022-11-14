import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_CONNECTION = process.env.MONGO_CONNECTION || "mongodb+srv://tomyov24:Alessandro.24@cluster0.zft9dcg.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(MONGO_CONNECTION);

export default mongoose;