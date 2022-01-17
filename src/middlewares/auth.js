const jwt = require('jsonwebtoken');

const secret = 'Co0kM@st&RPr0j3ct';

const generateToken = (email) => {
  const jwtConfig = {
    expiresIn: 3600,
    algorithm: 'HS256',
  };

  const token = jwt.sign({ email }, secret, jwtConfig);

  return token;
};

const validateToken = (token) => {
  try {
    const data = jwt.verify(token, secret);

    return data;
  } catch (error) {
    const error1 = { status: 401, message: 'jwt malformed' };
    throw error1;
  }
};

module.exports = {
  generateToken,
  validateToken,
};