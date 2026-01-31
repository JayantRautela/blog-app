import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import uplaodFile from "../middleware/multer.js";
import { createBlog, deleteBlog, updateBlog } from "../controllers/blogs.controller.js";

const router = express.Router();

router.post('/blog/new', isAuth, uplaodFile, createBlog);
router.post('/blog/update', isAuth, uplaodFile, updateBlog);
router.delete('/blog/delete', isAuth, deleteBlog);

export default router;