const { generateToken } = require('../middlewares/auth');
const { findUser } = require('../models/loginModel');

const verifyLogin = (email, password) => {
  if (!email || !password) {
    const error = { status: 401, message: 'All fields must be filled' };
    throw error;
  }
};

const verifyUser = async (email, password) => {
  const user = await findUser(email);

  if (!user || email !== user.email || password !== user.password) {
    const error = { status: 401, message: 'Incorrect username or password' };
    throw error;
  }
};

const insertLogin = async (email, password) => {
  verifyLogin(email, password);
  await verifyUser(email, password);
  const token = generateToken(email);

  return token;
};

module.exports = {
  verifyLogin,
  verifyUser,
  insertLogin,
};