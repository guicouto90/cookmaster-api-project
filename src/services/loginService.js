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

module.exports = {
  verifyLogin,
  verifyUser,
};