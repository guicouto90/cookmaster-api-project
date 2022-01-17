const Joi = require('@hapi/joi');
const { createUser, findByEmail } = require('../models/usersModels');

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

module.exports = {
  validateUser,
  insertUser,
  verifyEmail,
};
