const { verifyLogin, verifyUser } = require('../services/loginService');
const { generateToken } = require('../middlewares/auth');

const newLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    verifyLogin(email, password);

    await verifyUser(email, password);
    
    const token = generateToken(email);
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  newLogin,
};