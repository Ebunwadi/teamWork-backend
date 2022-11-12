import Joi from '@hapi/joi';

const schema = Joi.object().keys({
  categoryName: Joi.string()
    .min(3)
    .max(50)
    .required(),
});

const validateCategory = async (req, res, next) => {
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

export default validateCategory;
