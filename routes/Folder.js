import express from "express";
import createError from "http-errors";
import Folder from "../models/Folder.js";

const FolderRouter = express.Router();

FolderRouter.get("/", async (req, res, next) => {
  try {
    const listFolder = await Folder.find().sort({ updatedAt: "desc" });
    res.send(listFolder);
  } catch (error) {
    next(error);
  }
});

// Create a new folder
FolderRouter.post("/", async (req, res, next) => {
  try {
    const { name, authorId } = req.body;
    const newFolder = new Folder({ name, authorId });
    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (error) {
    next(error);
  }
});

FolderRouter.get("/:folderId", async (req, res, next) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.find({ _id: folderId }).exec();
    res.json(folder);
  } catch (error) {
    next(error);
  }
});

// Delete a folder by ID
FolderRouter.delete("/:id", async (req, res, next) => {
  try {
    const folderId = req.params.id;
    const deleteFolder = await Folder.findByIdAndDelete(folderId);
    if (!deleteFolder) {
      throw createError(404, "Blog not found");
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default FolderRouter;
