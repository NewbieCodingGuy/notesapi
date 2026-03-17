const notesService = require("../services/notesService.js");

const getAllNotes = async (req, res) => {
  try {
    const { userId } = req.user;
    const notes = await notesService.getAllNotes(userId);

    return res.status(200).json({
      message: "All Notes Fetched Successfully",
      notes,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    }

    console.error("Get Notes Error", err.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createNote = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, content } = req.body;
    const note = await notesService.createNote(userId, title, content);

    return res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    }

    console.error("Create Notes Error", err.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { userId } = req.user;
    const note = await notesService.getNoteById(noteId, userId);

    return res.status(200).json({
      message: "Note fetched successfully",
      note,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    }

    console.error("NoteById error ", err.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { userId } = req.user;
    const { title, content } = req.body;

    const note = await notesService.updateNote(noteId, userId, title, content);

    return res.status(200).json({
      message: "Note successfully updated!",
      note,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    }

    console.error("Update Note error ", err.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { userId } = req.user;

    const note = await notesService.deleteNote(noteId, userId);

    return res.status(200).json({
      message: "Note deleted successfully",
      note,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    }

    console.error("Delete Note error ", err.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
};
