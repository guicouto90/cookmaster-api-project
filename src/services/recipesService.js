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

const insertRecipe = async (name, ingredients, preparation, email) => {
  // const verify = validateToken(token);
  console.log(email);
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

/* const verifyToken = (token) => {
  if (!token) {
    const error = { status: 401, message: 'missing auth token' };
    throw error;
  }
  const verify = validateToken(token);
  if (!verify.email) {
    const error = { status: 401, message: 'jwt malformed' };
    throw error;
  };

  return verify;
} */

const updateRecipe = async (id, email, body) => {
  // const { email } = verifyToken(token);
  const { _id } = await findByEmail(email);
  await editRecipe(id, body, _id);
  const { name, ingredients, preparation } = body;
  const editedRecipe = { _id: id, name, ingredients, preparation, userId: _id };

  return editedRecipe;
};

const eraseRecipe = async (id) => {
  // verifyToken(token);
  await deleteRecipe(id);
};

const insertImageById = async (id) => {
  // verifyToken(token);
  const image = `localhost:3000/src/uploads/${id}.jpeg`;
  const { _id, name, ingredients, preparation, userId } = await findById(id);
  await insertImage(id, image);
  return { _id, name, ingredients, preparation, userId, image };
};

const getImage = async (id) => {
  const recipeId = id.split('.jpeg')[0];
  console.log(recipeId);
  const { image } = await findById(recipeId);

  return image;
};

module.exports = {
  validateRecipe,
  insertRecipe,
  getAllRecipes,
  getById,
  updateRecipe,
  eraseRecipe,
  insertImageById,
  getImage,
};