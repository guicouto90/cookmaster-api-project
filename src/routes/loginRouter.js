const express = require('express');
const { newLogin } = require('../controllers/loginController');

const loginRouter = express.Router();

loginRouter.post('/', newLogin);

module.exports = loginRouter;