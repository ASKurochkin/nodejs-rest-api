const checkSchema = require("./checkSchema");
const updateFavoriteSchema = require("./updateFavoriteSchema");
const { userSchema, emailSchema } = require("./userSchema");

module.exports = {
  checkSchema,
  updateFavoriteSchema,
  userSchema,
  emailSchema,
};
