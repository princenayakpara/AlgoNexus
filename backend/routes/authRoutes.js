const express = require("express");
const { googleLogin, getMe, register, login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/google", googleLogin);
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;