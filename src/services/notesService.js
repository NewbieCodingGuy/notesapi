const pool = require("../config/db.js");

const getAllNotes = async (userId) => {
  const [notes] = await pool.execute("SELECT * FROM notes WHERE user_id=?", [
    userId,
  ]);

  return notes;
};

const createNote = async (userId, title, content) => {
  const [note] = await pool.execute(
    "INSERT INTO notes (user_id, title, content) VALUES(?,?,?)",
    [userId, title, content],
  );

  if (!note.insertId) {
    const error = new Error("Note creation failed");
    error.statusCode = 500;
    throw error;
  }

  return {
    id: note.insertId,
    userId,
    title,
    content,
  };
};

const getNoteById = async (id, userId) => {
  const [note] = await pool.execute(
    "SELECT * FROM notes WHERE id = ? AND user_id = ?",
    [id, userId],
  );

  if (note.length === 0) {
    const error = new Error("No note exist with this id!");
    error.statusCode = 404;
    throw error;
  }

  return note[0];
};

const updateNote = async (id, userId, title, content) => {
  const [note] = await pool.execute(
    "UPDATE notes SET title=?, content=? WHERE id=? AND user_id=?",
    [title, content, id, userId],
  );

  if (note.affectedRows === 0) {
    const error = new Error("No Note found");
    error.statusCode = 404;
    throw error;
  }

  return note;
};

const deleteNote = async (id, userId) => {
  const [note] = await pool.execute(
    "DELETE FROM notes WHERE id=? AND user_id=?",
    [id, userId],
  );

  if (note.affectedRows === 0) {
    const error = new Error("No note found");
    error.statusCode = 404;
    throw error;
  }

  return note;
};

module.exports = {
  getAllNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
};
