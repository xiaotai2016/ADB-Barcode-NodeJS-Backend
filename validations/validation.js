const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  // console.log(data);
  const schema = Joi.object({
    company: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data.values);
};

module.exports.registerValidation = registerValidation;
