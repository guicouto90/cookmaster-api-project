const Joi = require('@hapi/joi');
const { validateToken } = require('../middlewares/auth');
const { createRecipe, findAllRecipes } = require('../models/recipesModel');
const { findByEmail } = require('../models/usersModels');

const recipeSchema = Joi.object({
  name: Joi.string().required(),
  ingredients: Joi.string().required(),
  preparation: Joi.string().required(),
});

const validateRecipe = (name, ingredients, preparation) => {
  const { error } = recipeSchema.validate({ name, ingredients, preparation });
  if (error || !name || !ingredients || !preparation) {
    const error1 = { status: 400, message: 'Invalid entries. Try again.' };
    throw error1;
  }
};

const insertRecipe = async (name, ingredients, preparation, token) => {
  const verify = validateToken(token);

  if (!verify.email) {
    const error = { status: 401, message: 'jwt malformed' };
    throw error;
  }

  const { _id } = await findByEmail(verify.email);

  const recipeId = await createRecipe(name, ingredients, preparation, _id);

  const newRecipe = {
    recipe: {
      name,
      ingredients,
      preparation,
      userId: _id,
      _id: recipeId,
    },
  };

  return newRecipe;
};

const getAllRecipes = async () => {
  const recipes = await findAllRecipes();

  return recipes;
};

module.exports = {
  validateRecipe,
  insertRecipe,
  getAllRecipes,
};