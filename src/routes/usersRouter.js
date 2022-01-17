const express = require('express');
const { newUser } = require('../controllers/usersController');

const userRouter = express.Router();

userRouter.post('/', newUser);

module.exports = userRouter;