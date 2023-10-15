const Contact = require("../../models/contact");
const { isValidId } = require("../../middlewares");
const { httpError } = require("../../utils");
const {checkSchema, updateFavoriteSchema} = require('../../schemas')

const express = require("express");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw httpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = checkSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", isValidId, async (req, res, next) => {
  try {
    const { error } = checkSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw httpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.patch("/:contactId/favorite", isValidId, async (req, res, next) => {
  try {
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw httpError(404, "Missing field favorite");
    }
    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw httpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      throw httpError(404, "Not found");
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
