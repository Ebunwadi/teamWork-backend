export default (req, res, next) => {
  if (req.body.isAdmin === false) {
    return res.status(403).send('Not allowed to perform this process');
  }
  next();
};
