const express = require('express');
const { newUser, showUsers, newAdmin } = require('../controllers/usersController');
const { validateToken } = require('../middlewares/auth');

const userRouter = express.Router();

userRouter.post('/', newUser);

userRouter.get('/', showUsers);

userRouter.post('/admin', validateToken, newAdmin);

module.exports = userRouter;