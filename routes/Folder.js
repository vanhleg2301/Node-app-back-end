import express from "express";
import createError from "http-errors";
import Folder from "../models/Folder.js";

const FolderRouter = express.Router();

FolderRouter.get("/", async (req, res, next) => {
  try {
    const listFolder = await Folder.find().sort({ updatedAt: "desc" }).exec();
    res.send(listFolder);
  } catch (error) {
    next(error);
  }
});

// Get Folder base on authId
FolderRouter.get("/:authId", async (req, res, next) => {
  try {
    const { authId } = req.params;

    // Tìm tất cả các thư mục có authorId là authId
    const listFolder = await Folder.find({ authorId: authId })
      .sort({ updatedAt: "desc" })
      .exec();

    res.send(listFolder);
  } catch (error) {
    next(error);
  }
});

//create
FolderRouter.post("/", async (req, res, next) => {
  try {
    const { name, authorId } = req.body;

    const newFolderData = {
      name,
      authorId: authorId || req.user.uid,
    };

    const newFolder = new Folder(newFolderData);
    const savedFolder = await newFolder.save();

    res.status(201).json(savedFolder);
  } catch (error) {
    next(error);
  }
});

// Update folder
FolderRouter.patch("/:folderId", async (req, res, next) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;

    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { name },
      { new: true }
    );

    if (!updatedFolder) {
      throw createError(404, "Folder not found");
    }

    res.json(updatedFolder);
  } catch (error) {
    next(error);
  }
});

// get folder by id
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
    if (!req.user) {
      throw createError(401, "Unauthorized");
    }
    const deleteFolder = await Folder.findByIdAndDelete(folderId);
    if (!deleteFolder) {
      throw createError(404, "Folder not found");
    }
    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default FolderRouter;
