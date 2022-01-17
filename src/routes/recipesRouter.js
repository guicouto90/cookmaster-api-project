const express = require('express');
const { newRecipe, listRecipes, listById } = require('../controllers/recipesController');

const recipesRouter = express.Router();

recipesRouter.post('/', newRecipe);

recipesRouter.get('/', listRecipes);

recipesRouter.get('/:id', listById);

module.exports = recipesRouter;