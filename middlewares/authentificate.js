const jwt = require("jsonwebtoken");
const { httpError } = require("../utils");
const User = require("../models/user");

const { SECRET_KEY } = process.env;

const authentificate = async (req, res, next) => {
  const { authorization = " " } = req.headers;

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(httpError(401, "Invalid token type"));
  }
  if(!jwt.decode(token)) {
    next(httpError(401, "Invalid token"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(httpError(401, "User not found"));
    }
    req.user = user;
    next();
  } catch {
    next(httpError(401, "Not authorized"));
  }
};

module.exports = authentificate;
