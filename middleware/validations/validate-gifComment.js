import Joi from '@hapi/joi';

const schema = Joi.object().keys({
  comment: Joi.string()
    .max(100)
    .required(),
});

const validateGifComment = async (req, res, next) => {
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

export default validateGifComment;
