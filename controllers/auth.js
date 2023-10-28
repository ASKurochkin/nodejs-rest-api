const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const jimp = require("jimp");
const fs = require("fs/promises");

const { httpError } = require("../utils");
const { userSchema } = require("../schemas");
const User = require("../models/user");

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      throw httpError(400);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw httpError(409);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      Status: "201 Created",
      "Content-Type": "application/json",
      ResponseBody: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw httpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw httpError(401, "Email or password is wrong");
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      Status: "200 OK",
      "Content-Type": "application/json",
      ResponseBody: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        Status: "401 Unauthorized",
        "Content-Type": "application/json",
        ResponseBody: {
          message: "Not authorized",
        },
      });
    }
    const { email, subscription } = req.user;
    res.status(200).json({
      Status: "200 OK",
      "Content-Type": "application/json",
      ResponseBody: {
        email,
        subscription,
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        Status: "401 Unauthorized",
        "Content-Type": "application/json",
        ResponseBody: {
          message: "Not authorized",
        },
      });
    }
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json({
      Status: "204 No Content",
    });
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempUpload, originalname } = req.file;
    const { _id } = req.user;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    const avatarURL = path.join("avatars", filename);

    const avatar = await jimp.read(tempUpload);
    await avatar.resize(250, 250).write(resultUpload);

    await fs.rename(tempUpload, resultUpload);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.status(200).json({
      Status: "200 OK",
      "Content-Type": "application/json",
      ResponseBody: {
        avatarURL,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getCurrent, logout, updateAvatar };
