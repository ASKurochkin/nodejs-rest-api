const express = require("express");
const {register, login, getCurrent, logout, updateAvatar} = require("../../controllers");
const { authentificate, upload } = require("../../middlewares");

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/current', authentificate, getCurrent)
router.post('/logout', authentificate, logout)
router.patch('/avatars', authentificate, upload.single("avatar"), updateAvatar)

module.exports = router;
