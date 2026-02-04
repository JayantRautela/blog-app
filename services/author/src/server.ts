import type { Express } from "express";
import express from "express";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";
dotenv.config();
import blogRoutes from "./routes/blogs.route.js";
import cloudinary from "cloudinary";
import { connectRabbitMQ } from "./utils/rabitmq.js";

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME!,
    api_key: process.env.CLOUD_API_KEY!,
    api_secret: process.env.CLOUD_API_SECRET!
});

const app: Express = express();

connectRabbitMQ();

const PORT = process.env.PORT;

async function dbInit() {
  try {
    await sql `
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        blogContent TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql `
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        comment VARCHAR(255) NOT NULL,
        userId VARCHAR(255) NOT NULL,
        blogId VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql `
      CREATE TABLE IF NOT EXISTS saved_blogs (
        id SERIAL PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        blogId VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Init DB :- ", error);
  }
}

app.use('/api/v1', blogRoutes);

dbInit().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});