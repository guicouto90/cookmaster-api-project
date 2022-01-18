const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');
const { validateToken } = require('../middlewares/auth');
const { 
  createRecipe, 
  findAllRecipes, 
  findById, 
  editRecipe, 
  deleteRecipe, 
} = require('../models/recipesModel');
const { findByEmail } = require('../models/usersModels');

const recipeSchema = Joi.object({
  name: Joi.string().required(),
  ingredients: Joi.string().required(),
  preparation: Joi.string().required(),
});

const validateRecipe = (body) => {
  const { name, ingredients, preparation } = body;
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

const getById = async (id) => {
  const valid = ObjectId.isValid(id);

  if (!valid) {
    const error = { status: 404, message: 'recipe not found' };
    throw error;
  }

  const recipe = await findById(id);
  if (!recipe) {
    const error = { status: 404, message: 'recipe not found' };
    throw error;
  }

  return recipe;
};

const updateRecipe = async (id, token, body) => {
  if (!token) {
    const error = { status: 401, message: 'missing auth token' };
    throw error;
  }
  const verify = validateToken(token);
  if (!verify.email) {
    const error = { status: 401, message: 'jwt malformed' };
    throw error;
  }
  const { _id } = await findByEmail(verify.email);
  await editRecipe(id, body, _id);
  const { name, ingredients, preparation } = body;
  const editedRecipe = { _id: id, name, ingredients, preparation, userId: _id };

  return editedRecipe;
};

const eraseRecipe = async (token, id) => {
  if (!token) {
    const error = { status: 401, message: 'missing auth token' };
    throw error;
  }
  const verify = validateToken(token);
  if (!verify.email) {
    const error = { status: 401, message: 'jwt malformed' };
    throw error;
  }

  await deleteRecipe(id);
};

module.exports = {
  validateRecipe,
  insertRecipe,
  getAllRecipes,
  getById,
  updateRecipe,
  eraseRecipe,
};