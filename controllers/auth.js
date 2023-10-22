const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { httpError } = require("../utils");
const { loginSchema, registerSchema } = require("../schemas");
const User = require("../models/user");
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw httpError(409, "Email already registered");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
      email: newUser.email,
      password: newUser.password,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw httpError(401, "Email or password invalid.");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw httpError(401, "Email or password invalid.");
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    res.status(201).json({
      token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
