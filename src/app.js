const express = require("express");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app = express();

const verifyToken = require("./middlewares/verifyToken.js");

app.use(express.json());

//Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.get("/api/protected", verifyToken, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    user: req.user,
  });
});

app.use("/api/auth", authRoutes);

module.exports = app;
