const express = require('express');
const path = require('path');
const userRouter = require('../routes/usersRouter');
const errorMiddleware = require('../middlewares/errorHandler');
const loginRouter = require('../routes/loginRouter');
const recipesRouter = require('../routes/recipesRouter');

const app = express();

app.use(express.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/users', userRouter);

app.use('/login', loginRouter);

app.use('/recipes', recipesRouter);

app.use('/images', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errorMiddleware);

module.exports = app;
