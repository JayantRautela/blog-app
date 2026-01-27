import type { Express } from "express";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./utils/db.js";

const app: Express = express();

connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on PORT :- ${PORT}`);
})