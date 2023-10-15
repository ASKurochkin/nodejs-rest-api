const Joi = require("joi");

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

module.exports = checkSchema;
