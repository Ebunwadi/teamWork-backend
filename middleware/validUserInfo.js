const validInfo = (req, res, next) => {
  const {
    email, firstName, password, lastName, gender, jobRole, department, address, isAdmin,
  } = req.body;

  function validEmail(userEmail) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }
  if (req.path === '/create-user') {
    if (![email, firstName, password, lastName, gender,
      jobRole, department, address, isAdmin].every(Boolean)) {
      res.status(401).json({
        status: 'error',
        error: 'missing credentials',
      });
    }
    if (!validEmail(email)) {
      return res.status(401).json({
        status: 'error',
        error: 'invalid email',
      });
    }
  }
  next();
};

export default validInfo;
