const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const {
  registerRules,
  loginRules,
} = require("../middlewares/authValidation.js");
const validate = require("../middlewares/validate.js");

router.post("/register", validate(registerRules), authController.register);
router.post("/login", validate(loginRules), authController.login);

module.exports = router;
