import axios from "axios";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
import { redisClient } from "../utils/redis.js";

export const getAllBlogs = TryCatch( async (req, res) => {
  const { searchQuery = "" , category = "" } = req.query;
  let blogs;

  const cacheKey = `blogs:${searchQuery}:${category}`;

  const cache = await redisClient.get(cacheKey);

  if (cache) {
    console.log("Serving from redis cache.");
    res.status(200).json({
      data: JSON.parse(cache)
    });
    return;
  }

  if (searchQuery && category) {
    blogs = await sql `SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) AND category = ${category} ORDER BY created_at DESC`;
  } else if (searchQuery){
    blogs = await sql `SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) ORDER BY created_at DESC`;
  } else if (category){
    blogs = await sql `SELECT * FROM blogs WHERE category = ${category} ORDER BY created_at DESC`;
  } else {
    blogs = await sql `SELECT * FROM blogs ORDER BY created_at DESC`;
  }

  console.log("Serving from database");

  await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 3600 });

  res.status(200).json({
    blogs
  });
})

export const getSingleBlog = TryCatch( async (req, res) => {
  const blogId = req.params.id;

  const cacheKey = `blog:${blogId}`;

  const cache = await redisClient.get(cacheKey);

  if (cache) {
    console.log("Serving from redis cache.");
    res.status(200).json({
      data: JSON.parse(cache)
    });
    return;
  }

  const blog = await sql `SELECT * FROM blogs WHERE id = ${blogId}`;

  if (blog.length === 0) {
    res.status(404).json({
      message: "No blog with this id found"
    });
    return;
  }

  const { data } = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${blog[0]?.author}`); 

  const responseData = { blog: blog[0], author: data };

  await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 3600 });

  res.status(200).json({
    data: responseData
  });
})