const { insertUser, validateUser, verifyEmail } = require('../services/usersService');

const newUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    validateUser(name, email, password);
    
    await verifyEmail(email);
    
    const user = await insertUser(name, email, password);
    
    return res.status(201).json(user);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  newUser,
};