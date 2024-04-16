import express from "express";
import createError from "http-errors";
import Note from "../models/Note.js";
import Folder from "../models/Folder.js";

const NoteRouter = express.Router();

NoteRouter.get("/", async (req, res, next) => {
  try {
    const listNote = await Note.find().exec();
    res.send(listNote);
  } catch (error) {
    next(error);
  }
});

// get note by folderId
NoteRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const notes = await Note.find({ folderId: id }).exec();

    if (!notes) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(notes);
  } catch (error) {
    next(error);
  }
});

// get note by content
NoteRouter.get("/note/:content", async (req, res, next) => {
  try {
    const { content } = req.params;
    const note = await Note.find({ content: content }).exec();

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
});

// Create a new note
NoteRouter.post("/", async (req, res, next) => {
  try {
    const { content, folderId } = req.body;

    const folder = await Folder.findOne({ _id: folderId });

    if (!folder) {
      return res.status(400).json({ message: "Folder not found" });
    }

    const newNote = new Note({ content, folderId: folder._id });

    const savedNote = await newNote.save();

    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

export default NoteRouter;
