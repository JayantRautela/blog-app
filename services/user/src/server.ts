import type { Express } from "express";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.route.js";

const app: Express = express();

app.use(express.json());

connectDB();

app.use("/api/v1", userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on PORT :- ${PORT}`);
})