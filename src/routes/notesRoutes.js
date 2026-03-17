const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController.js");
const { noteRules } = require("../middlewares/notesValidation.js");
const validate = require("../middlewares/validate.js");
const verifyToken = require("../middlewares/verifyToken.js");

router.get("/notes", verifyToken, notesController.getAllNotes);

router.post(
  "/notes",
  verifyToken,
  validate(noteRules),
  notesController.createNote,
);

router.get("/notes/:id", verifyToken, notesController.getNoteById);

router.put(
  "/notes/:id",
  verifyToken,
  validate(noteRules),
  notesController.updateNote,
);

router.delete("/notes/:id", verifyToken, notesController.deleteNote);

module.exports = router;
