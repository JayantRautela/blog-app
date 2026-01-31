import type { Express } from "express";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})