const { isValidId } = require("../../middlewares");

const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  updateFavorite,
  deleteContact,
} = require("../../controllers");

const express = require("express");

const router = express.Router();

router.get("/", getAllContacts);

router.get("/:contactId", isValidId, getContactById);

router.post("/", addContact);

router.put("/:contactId", isValidId, updateContact);

router.patch("/:contactId/favorite", isValidId, updateFavorite);

router.delete("/:contactId", isValidId, deleteContact);

module.exports = router;
