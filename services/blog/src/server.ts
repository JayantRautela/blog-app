import express from "express";
import dotenv from "dotenv";
dotenv.config();
import blogRouter from "./routes/blog.route.js";

const app = express();
app.use(express.json());

app.use('/api/v1', blogRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})