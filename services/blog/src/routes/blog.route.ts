import express from "express";
import { getAllBlogs } from "../controllers/blog.controller.js";

const router = express.Router();

router.get('/blogs/all', getAllBlogs);

export default router;