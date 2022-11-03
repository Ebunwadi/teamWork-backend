const adminAuth = (req, res, next) => {
  if (req.user.isAdmin === false) {
    return res.status(403).json({
      status: 'error',
      error: 'Only an admin can handle this operation',
    });
  }

  next();
};

export default adminAuth;
