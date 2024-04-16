import express from "express";
import createError from "http-errors";
import Note from "../models/Note.js";

const NoteRouter = express.Router();

NoteRouter.get("/", async (req, res, next) => {
  try {
    const listNote = await Note.find().exec();
    res.send(listNote);
  } catch (error) {
    next(error);
  }
});

// Create a new note
NoteRouter.post("/", async (req, res, next) => {
  try {
    const { content, folderId } = req.body;
    const newNote = new Note({ content, folderId });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});
export default NoteRouter;
