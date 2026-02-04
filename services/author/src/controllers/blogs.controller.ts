import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import { invalidateCacheJob } from "../utils/rabitmq.js";
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

export const updateBlog = TryCatch ( async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, description, blogContent, category } = req.body;
  const file = req.file;

  const blog = await sql `SELECT * FROM blogs WHERE id = ${id}`;

  await invalidateCacheJob(["blogs:*"]);

  if (!blog.length) {
    res.status(404).json({
      message: "No blog found"
    });
    return;
  }

  if (blog[0]?.author !== req.user?._id) {
    res.status(401).json({
      message: "You are not authorized to update the blog"
    });
    return;
  }

  let imageUrl = blog[0]?.image;

  if (file) {
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

    imageUrl = cloud.secure_url;
  }

  const updatedBlog = await sql `UPDATE blogs SET
    title = ${title || blog[0]?.title},
    description = ${description || blog[0]?.description},
    image = ${imageUrl},
    blogContent = ${blogContent || blog[0]?.blogContent},
    category = ${category || blog[0]?.category}
    WHERE  id = ${id}
    RETURNING *;
  `;

  res.status(201).json({
    message: "Blog updated successfully",
    blog: updatedBlog[0]
  });
  return;
})

export const deleteBlog = TryCatch( async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const blog = await sql `SELECT * FROM blogs WHERE id = ${id}`;

  if (!blog.length) {
    res.status(404).json({
      message: "No blog found"
    });
    return;
  }

  if (blog[0]?.author !== req.user?._id) {
    res.status(401).json({
      message: "You are not authorized to update the blog"
    });
    return;
  }

  await sql `DELETE FROM saved_blogs WHERE blogId = ${req.params.id}`;
  await sql `DELETE FROM comments WHERE blogId = ${req.params.id}`;
  await sql `DELETE FROM blogs WHERE id = ${req.params.id}`;

  res.status(200).json({
    message: "Blog deleted successfully"
  });
  return;
})