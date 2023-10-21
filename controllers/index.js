const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  updateFavorite,
  deleteContact,
} = require("./contacts");

const { register } = require("./auth");

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  updateFavorite,
  deleteContact,
  register,
};
