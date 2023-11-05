const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const jimp = require("jimp");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const { httpError, sendEmail } = require("../utils");
const { userSchema, emailSchema } = require("../schemas");
const User = require("../models/user");

const { SECRET_KEY, BASE_URL } = process.env;

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
    const verificationToken = nanoid();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

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
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (error) {
      throw httpError(400, error.message);
    }

    if (!user) {
      throw httpError(404, "Email or password is wrong");
    }

    if (!user.verify) {
      throw httpError(401, "Email not verified");
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

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw httpError(404, "Email not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: "",
    });

    res.status(200).json({
      Status: "200 OK",
      "Content-Type": "application/json",
      ResponseBody: {
        message: "Email verify success",
      },
    });
  } catch (err) {
    next(err);
  }
};

const resendVerifyEmail = async (req, res, next) => {
  try {
    const { error } = emailSchema.validate(req.body);
    if (error) {
      throw httpError(400, "Missing required field email");
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw httpError(401, "Email not found");
    }
    if (user.verify) {
      throw httpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(200).json({
      Status: "200 OK",
      "Content-Type": "application/json",
      ResponseBody: {
        email,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};
