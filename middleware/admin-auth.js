const adminAuth = (req, res, next) => {
  if (req.body.isAdmin === false) {
    return res.status(403).json({
      status: 'error',
      error: 'Only an admin can register employees',
    });
  }

  next();
};

export default adminAuth;
