const express = require("express");
const router = express.Router();
const { regester, login } = require("../controller/authController");

router.post("/register", regester);
router.post("/login", login);

module.exports = router;
