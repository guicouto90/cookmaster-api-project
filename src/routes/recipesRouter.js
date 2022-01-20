const express = require('express');
const { 
  newRecipe, 
  listRecipes, 
  listById, 
  updateById,
  eraseById,
  newImage,
} = require('../controllers/recipesController');
const { validateToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const recipesRouter = express.Router();

recipesRouter.post('/', validateToken, newRecipe);

recipesRouter.get('/', listRecipes);

recipesRouter.get('/:id', listById);

recipesRouter.put('/:id', validateToken, updateById);

recipesRouter.put('/:id/image', validateToken, upload.single('image'), newImage);

recipesRouter.delete('/:id', validateToken, eraseById);

module.exports = recipesRouter;