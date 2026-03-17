const express = require("express");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes.js");
const app = express();

const verifyToken = require("./middlewares/verifyToken.js");

app.use(express.json());

//Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", notesRoutes);

module.exports = app;
