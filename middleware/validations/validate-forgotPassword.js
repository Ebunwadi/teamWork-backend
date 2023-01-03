import Joi from '@hapi/joi';

const schema = Joi.object().keys({
  password: Joi.string()
    .min(4)
    .max(50)
    .required(),
});

const validateForgotPassword = async (req, res, next) => {
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

export default validateForgotPassword;
