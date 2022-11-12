import Joi from '@hapi/joi';

const articleSchema = Joi.object().keys({
  title: Joi.string().max(50).required(),
  article: Joi.string().max(2500).required(),
  categoryId: Joi.number().required(),
});

const editArticleSchema = Joi.object().keys({
  title: Joi.string().max(50).required(),
  article: Joi.string().max(2500).required(),
});

const articleCommentSchema = Joi.object().keys({
  comment: Joi.string()
    .max(100)
    .required(),
});

export const validateArticle = async (req, res, next) => {
  try {
    await articleSchema.validateAsync(req.body);
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

export const validateEditArticle = async (req, res, next) => {
  try {
    await editArticleSchema.validateAsync(req.body);
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

export const validateArticleComment = async (req, res, next) => {
  try {
    await articleCommentSchema.validateAsync(req.body);
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
