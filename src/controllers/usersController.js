const { 
  insertUser, 
  validateUser, 
  verifyEmail, 
  listUsers, 
  validateRoleAdmin, 
  insertAdmin, 
} = require('../services/usersService');

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

const showUsers = async (req, res, next) => {
  try {
    const result = await listUsers();

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const newAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    validateUser(name, email, password);
    await verifyEmail(email);

    await validateRoleAdmin(req.email);
    const admin = await insertAdmin(name, email, password);

    return res.status(201).json(admin);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  newUser,
  showUsers,
  newAdmin,
};