const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  updateFavorite,
  deleteContact,
} = require("./contacts");

const  {register, login, getCurrent, logout, updateAvatar} = require("./auth");

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  updateFavorite,
  deleteContact,
  register,
  login,
  getCurrent,
  logout,
  updateAvatar  
};
