const Joi = require("joi");

module.exports = Joi.object({
  email: Joi.string().email().required().label("Email"),
  otp: Joi.string().required().label("Otp"),
});
