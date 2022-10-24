export default (req, res, next) => {
  if (req.path === '/create-user') {
    if (req.body.isAdmin === false) {
      return res.status(403).send('Not allowed to perform this process');
    }
  }

  next();
};
