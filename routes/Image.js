import express from "express";
import createError from "http-errors";
import bcrypt from "bcrypt";
import Image from "../models/Image.js";

const ImageRouter = express.Router();

ImageRouter.get("/", async (req, res, next) => {
  try {
    const images = await Image.find();
    res.send(images);
  } catch (error) {
    return next(createError(500, error.message));
  }
});

ImageRouter.get("/:src", async (req, res, next) => {
  try {
    const src = req.params.src;
    const image = await Image.findOne({ src: src });
    if (!image) {
      return next(createError(404, "Image not found"));
    }
    res.send(image);
  } catch (error) {
    return next(createError(500, error.message));
  }
});

export default ImageRouter;
