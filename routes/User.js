import express from "express";
import createError from "http-errors";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const UserRouter = express.Router();

UserRouter.get("/", async (req, res, next) => {
  try {
    const listUser = await User.find().exec();
    res.send(listUser);
  } catch (error) {
    next(error);
  }
});

// Get a user by ID
UserRouter.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default UserRouter;
