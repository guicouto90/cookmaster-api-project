const { insertLogin } = require('../services/loginService');

const newLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await insertLogin(email, password);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  newLogin,
};