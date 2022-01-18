const express = require('express');
const { 
  newRecipe, 
  listRecipes, 
  listById, 
  updateById,
  eraseById, 
} = require('../controllers/recipesController');

const recipesRouter = express.Router();

recipesRouter.post('/', newRecipe);

recipesRouter.get('/', listRecipes);

recipesRouter.get('/:id', listById);

recipesRouter.put('/:id', updateById);

recipesRouter.delete('/:id', eraseById);

module.exports = recipesRouter;