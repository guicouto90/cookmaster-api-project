const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');
const { 
  createRecipe, 
  findAllRecipes, 
  findById, 
  editRecipe, 
  deleteRecipe,
  insertImage, 
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

const insertRecipe = async (body, email) => {
  const { name, ingredients, preparation } = body;
  validateRecipe(body);
  const { _id } = await findByEmail(email);

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

const updateRecipe = async (id, email, body) => {
  validateRecipe(body);
  const { _id } = await findByEmail(email);
  await editRecipe(id, body, _id);
  const { name, ingredients, preparation } = body;
  const editedRecipe = { _id: id, name, ingredients, preparation, userId: _id };

  return editedRecipe;
};

const eraseRecipe = async (id) => {
  await deleteRecipe(id);
};

const insertImageById = async (id) => {
  const image = `localhost:3000/src/uploads/${id}.jpeg`;
  const { _id, name, ingredients, preparation, userId } = await findById(id);
  await insertImage(id, image);
  return { _id, name, ingredients, preparation, userId, image };
};

module.exports = {
  validateRecipe,
  insertRecipe,
  getAllRecipes,
  getById,
  updateRecipe,
  eraseRecipe,
  insertImageById,
};