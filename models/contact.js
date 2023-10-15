const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../utils");

/* eslint-disable prefer-regex-literals */
const checkSchema = Joi.object({
  name: Joi.string().required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: false,
    })
    .required(),

  phone: Joi.string()
    .pattern(new RegExp("\\(\\d{3}\\) \\d{3}-\\d{4}"))
    .required(),

  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = { checkSchema, updateFavoriteSchema };

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };
