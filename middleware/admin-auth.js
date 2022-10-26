export default (req, res, next) => {
  if (req.path === '/create-user') {
    if (req.body.isAdmin === false) {
      return res.status(403).json({
        status: 'error',
        error: 'Only an admin can perform this action',
      });
    }
  }

  next();
};
