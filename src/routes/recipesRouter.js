const express = require('express');
const { newRecipe } = require('../controllers/recipesController');

const recipesRouter = express.Router();

recipesRouter.post('/', newRecipe);

module.exports = recipesRouter;