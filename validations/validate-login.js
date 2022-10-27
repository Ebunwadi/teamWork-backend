import Joi from '@hapi/joi';

const validateLogin = (user) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(4)
      .max(50)
      .required(),
  });
  return schema.validate(user);
};

// module.exports.validateLogin = validateUser;

export default validateLogin;
