const { 
  insertUser, 
  listUsers, 
  insertAdmin, 
} = require('../services/usersService');

const newUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
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
    const admin = await insertAdmin(name, email, password, req.email);

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