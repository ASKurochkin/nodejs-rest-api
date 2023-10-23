const { isValidId, authentificate } = require("../../middlewares");

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

router.get("/", authentificate, getAllContacts);

router.get("/:contactId", authentificate, isValidId, getContactById);

router.post("/", authentificate, addContact);

router.put("/:contactId", authentificate, isValidId, updateContact);

router.patch("/:contactId/favorite", authentificate, isValidId, updateFavorite);

router.delete("/:contactId", authentificate, isValidId, deleteContact);

module.exports = router;
