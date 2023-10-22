const express = require("express");
const {register, login, getCurrent, logout} = require("../../controllers");
const { authentificate } = require("../../middlewares");

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/current', authentificate, getCurrent)
router.post('/logout', authentificate, logout)

module.exports = router;
