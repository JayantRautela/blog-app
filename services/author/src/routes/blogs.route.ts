import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import uplaodFile from "../middleware/multer.js";
import { createBlog, updateBlog } from "../controllers/blogs.controller.js";

const router = express.Router();

router.post('/blog/new', isAuth, uplaodFile, createBlog);
router.post('/blog/update', isAuth, uplaodFile, updateBlog);

export default router;