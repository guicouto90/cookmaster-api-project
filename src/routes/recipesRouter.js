const express = require('express');
const { newRecipe, listRecipes } = require('../controllers/recipesController');

const recipesRouter = express.Router();

recipesRouter.post('/', newRecipe);

recipesRouter.get('/', listRecipes);

module.exports = recipesRouter;