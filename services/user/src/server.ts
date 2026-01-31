import type { Express } from "express";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME!,
    api_key: process.env.CLOUD_API_KEY!,
    api_secret: process.env.CLOUD_API_SECRET!
});

const app: Express = express();

app.use(express.json());

connectDB();

app.use("/api/v1", userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on PORT :- ${PORT}`);
})