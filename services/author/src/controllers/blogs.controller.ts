import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
import { v2 as cloudinary } from "cloudinary";
export const createBlog = TryCatch( async (req: AuthenticatedRequest, res) => {
  const { title, description, blogContent, category } = req.body;
  const file = req.file;

  if (!file) {
    res.status(400).json({
      message: "No file to upload"
    });
    return;
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    res.status(400).json({
      message: "Failed to generate file bufer"
    });
    return;
  }

  const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
    folder: "blogs"
  });

  const result = await sql `
    INSERT INTO blogs (title, description, image, blogContent, category, author) VALUES (${title}, ${description}, ${cloud.secure_url}, ${blogContent}, ${category}, ${req.user?._id}) RETURNING *;
  `;

  res.status(201).json({
    message : "Blog created",
    blog: result[0]
  });
  return;
})