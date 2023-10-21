const express = require("express");
const {register} = require("../../controllers")

const router = express.Router('/users/register', register);

module.exports = router;
