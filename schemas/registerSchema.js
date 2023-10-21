const Joi = require("joi");

/* eslint-disable prefer-regex-literals */
const registerSchema = Joi.object({
  name: Joi.string().required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: false,
    })
    .required(),

    password: Joi.string().required(),
});

module.exports = registerSchema;