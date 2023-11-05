const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: false,
    })
    .required(),

  password: Joi.string().min(6).required(),
});

const emailSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: false,
    })
    .required(),
});

module.exports = {userSchema, emailSchema};
