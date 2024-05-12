import express from "express";
import createError from "http-errors";
import Note from "../models/Note.js";
import Folder from "../models/Folder.js";

const NoteRouter = express.Router();

NoteRouter.get("/", async (req, res, next) => {
  try {
    const listNote = await Note.find().sort({ updatedAt: "desc" }).exec();
    res.send(listNote);
  } catch (error) {
    next(error);
  }
});

// get note by folderId
NoteRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const notes = await Note.find({ folderId: id })
      .sort({ updatedAt: "desc" })
      .exec();

    if (!notes) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.send(notes);
  } catch (error) {
    next(error);
  }
});

// Update note by ID
NoteRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, folderId } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { content, folderId },
      { new: true }
    );

    if (!updatedNote) {
      throw createError(404, "Note not found");
    }

    res.send(updatedNote);
  } catch (error) {
    next(error);
  }
});

// Create a new note
NoteRouter.post("/", async (req, res, next) => {
  try {
    const { content, folderId } = req.body;

    // const folder = await Folder.findOne({ _id: folderId });
    // if (!folder) {
    //   return res.status(400).json({ message: "Folder not found" });
    // }

    const newNote = new Note({ content, folderId: folderId });
    const savedNote = await newNote.save();

    res.status(201).send(savedNote);
  } catch (error) {
    next(error);
  }
});

// get note by id
NoteRouter.get("/note/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.send(note);
  } catch (error) {
    next(error);
  }
});

// Delete a folder by ID
NoteRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id: noteId } = req.params;
    const deleteNote = await Note.findByIdAndDelete(noteId);
    if (!deleteNote) {
      throw createError(404, "Note not found");
    }
    res.send({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default NoteRouter;
