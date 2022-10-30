import Joi from '@hapi/joi';

const schema = Joi.object().keys({
  firstName: Joi.string()
    .min(3)
    .max(50)
    .required(),
  lastName: Joi.string()
    .min(3)
    .max(50)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(4)
    .max(50)
    .required(),
  gender: Joi.string().required(),
  jobRole: Joi.string()
    .min(3)
    .max(50)
    .required(),
  department: Joi.string()
    .min(3)
    .max(50)
    .required(),
  address: Joi.string()
    .min(3)
    .max(50)
    .required(),
  isAdmin: Joi.boolean(),
});

const validateSignUp = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    if (error) {
      return res.status(401).json({
        status: 'error',
        error: error.details[0].message,
      });
    }
  }

  next();
};

export default validateSignUp;
