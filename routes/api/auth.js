const express = require("express");
const {register} = require("../../controllers")

const router = express.Router('/register', register);

module.exports = router;
