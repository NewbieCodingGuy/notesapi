const { body } = require("express-validator");

const noteRules = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1 })
    .withMessage("Minimum 1 character required"),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 1 })
    .withMessage("Minimum 1 character required"),
];

module.exports = { noteRules };
