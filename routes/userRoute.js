const express = require("express");
const router = express.Router();
const { signup, login,  verify} = require("../controllers/userController");


router.post("/signup", signup);
router.post("/login", login)
router.get('/verify/:token', verify)

module.exports = router;
