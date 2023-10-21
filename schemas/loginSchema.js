const Joi = require("joi");

/* eslint-disable prefer-regex-literals */
const loginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: false,
    })
    .required(),

    password: Joi.string().required(),
});

module.exports = loginSchema;