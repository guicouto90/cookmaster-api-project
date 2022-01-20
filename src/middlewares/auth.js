const jwt = require('jsonwebtoken');

let error1;

const secret = 'Co0kM@st&RPr0j3ct';

const generateToken = (email) => {
  const jwtConfig = {
    expiresIn: 3600,
    algorithm: 'HS256',
  };

  const token = jwt.sign({ email }, secret, jwtConfig);

  return token;
};

const validateToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      const error = { status: 401, message: 'missing auth token' };
      throw error;
    }
    const { email } = jwt.verify(authorization, secret);
    req.email = email;
    next();
  } catch (error) {
    console.error(error.message);
    if (error.message === 'missing auth token') {
      error1 = { status: 401, message: 'missing auth token' };
      next(error1);
    }
    error1 = { status: 401, message: 'jwt malformed' };
    next(error1);
  }
};

module.exports = {
  generateToken,
  validateToken,
};