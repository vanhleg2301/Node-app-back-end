import express from "express";
import createError from "http-errors";

import bcrypt from "bcrypt";
import Blog from "../models/Blog.js";

const BlogRouter = express.Router();

BlogRouter.get("/", async (req, res, next) => {
  try {
    const listBlog = await Blog.find().exec();
    res.send(listBlog);
  } catch (error) {
    next(error);
  }
});

// Create a new blog
BlogRouter.post("/", async (req, res, next) => {
  try {
    const { userId, name, content } = req.body;
    const newBlog = new Blog({ userId, name, content });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

// Route để lấy các bài đăng của một người dùng dựa trên userId
BlogRouter.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const blogs = await Blog.find({ userId: userId }).exec();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// Get a blog by ID
BlogRouter.get("/:id", async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId).populate("users").exec();
    if (!blog) {
      throw createError(404, "Blog not found");
    }
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

// Delete a blog by ID
BlogRouter.delete("/:id", async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      throw createError(404, "Blog not found");
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default BlogRouter;
