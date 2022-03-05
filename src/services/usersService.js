const Joi = require('@hapi/joi');
const { createUser, findByEmail, getAllUsers } = require('../models/usersModels');

const usersSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validateUser = (name, email, password) => {
  const { error } = usersSchema.validate({ name, email, password });
  if (error || !name || !email || !password) {
    const error1 = { status: 400, message: 'Invalid entries. Try again.' };
    throw error1;
  }
};

const verifyEmail = async (email) => {
  const verify = await findByEmail(email);

  if (verify) {
    const error1 = { status: 409, message: 'Email already registered' };
    throw error1;
  }
};

const insertUser = async (name, email, password) => {
  validateUser(name, email, password);   
  await verifyEmail(email);
  const userId = await createUser(name, email, password, 'user');

  const newUser = {
    user: {
      name,
      email,
      role: 'user',
      _id: userId,
    },
  };

  return newUser;
};

const listUsers = async () => {
  const result = await getAllUsers();

  return result;
};

const validateRoleAdmin = async (email) => {
  const { role } = await findByEmail(email);
  if (role !== 'admin') {
    const error = { status: 403, message: 'Only admins can register new admins' };
    throw error;
  }
};

const insertAdmin = async (name, email, password, emailRole) => {
  validateUser(name, email, password);
  await verifyEmail(email);
  await validateRoleAdmin(emailRole);
  const userId = await createUser(name, email, password, 'admin');

  const newUser = {
    user: {
      name,
      email,
      role: 'admin',
      _id: userId,
    },
  };

  return newUser;
}; 

module.exports = {
  validateUser,
  insertUser,
  verifyEmail,
  listUsers,
  validateRoleAdmin,
  insertAdmin,
};
