const express = require('express');
const path = require('path');
const { 
  newRecipe, 
  listRecipes, 
  listById, 
  updateById,
  eraseById,
  newImage, 
} = require('../controllers/recipesController');
// const uploads = require('../uploads')

const recipesRouter = express.Router();

recipesRouter.use(express.static(path.resolve(__dirname, '/uploads')));

recipesRouter.post('/', newRecipe);

recipesRouter.get('/', listRecipes);

recipesRouter.get('/:id', listById);

recipesRouter.put('/:id', updateById);

recipesRouter.put('/:id/image', newImage);

recipesRouter.delete('/:id', eraseById);

module.exports = recipesRouter;