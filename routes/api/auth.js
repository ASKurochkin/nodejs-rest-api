const express = require("express");
const {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers");

const { authentificate, upload } = require("../../middlewares");

const router = express.Router();

// Register users
router.post("/register", register);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", resendVerifyEmail);

// Login users
router.post("/login", login);
router.get("/current", authentificate, getCurrent);

// Logout users
router.post("/logout", authentificate, logout);

// Add avatars
router.patch("/avatars", authentificate, upload.single("avatar"), updateAvatar);

module.exports = router;
