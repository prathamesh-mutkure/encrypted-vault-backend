const express = require("express");
const { check, validationResult } = require("express-validator");
const { login, register } = require("../controllers/auth_controller");

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

module.exports = router;
