import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import uplaodFile from "../middleware/multer.js";
import { createBlog } from "../controllers/blogs.controller.js";

const router = express.Router();

router.post('/blog/new', isAuth, uplaodFile, createBlog);

export default router;